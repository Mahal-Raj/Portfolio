"use client"

import { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import {
  AdditiveBlending,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Group,
  MathUtils,
  Matrix4,
  Quaternion,
  Shape,
  SRGBColorSpace,
  TextureLoader,
  TubeGeometry,
  Vector3,
} from "three"

const EARTH_RADIUS = 1.5
const PUNJAB = { latitude: 31.1471, longitude: 75.3412 }
const ONTARIO = { latitude: 43.6532, longitude: -79.3832 }

type GlobeProps = {
  targetRotation: number
  reduceMotion: boolean
}

type JourneyPath = {
  curve: CatmullRomCurve3
  start: Vector3
  end: Vector3
  yaw: number
}

function coordinateToVector(latitude: number, longitude: number, radius = EARTH_RADIUS) {
  const latitudeRadians = MathUtils.degToRad(latitude)
  const textureLongitude = MathUtils.degToRad(longitude + 180)

  return new Vector3(
    -radius * Math.cos(latitudeRadians) * Math.cos(textureLongitude),
    radius * Math.sin(latitudeRadians),
    radius * Math.cos(latitudeRadians) * Math.sin(textureLongitude),
  )
}

function createJourneyPath(): JourneyPath {
  const startDirection = coordinateToVector(PUNJAB.latitude, PUNJAB.longitude, 1).normalize()
  const endDirection = coordinateToVector(ONTARIO.latitude, ONTARIO.longitude, 1).normalize()
  const angle = Math.acos(MathUtils.clamp(startDirection.dot(endDirection), -1, 1))
  const angleSine = Math.sin(angle)

  const points = Array.from({ length: 73 }, (_, index) => {
    const progress = index / 72
    const startWeight = Math.sin((1 - progress) * angle) / angleSine
    const endWeight = Math.sin(progress * angle) / angleSine
    const direction = startDirection.clone().multiplyScalar(startWeight).add(
      endDirection.clone().multiplyScalar(endWeight),
    ).normalize()
    const altitude = 0.035 + Math.sin(Math.PI * progress) * 0.24
    return direction.multiplyScalar(EARTH_RADIUS + altitude)
  })

  const curve = new CatmullRomCurve3(points)
  const projectedMidpoint = new Vector3(startDirection.x, 0, startDirection.z).normalize().add(
    new Vector3(endDirection.x, 0, endDirection.z).normalize(),
  )

  return {
    curve,
    start: curve.getPointAt(0),
    end: curve.getPointAt(1),
    yaw: Math.atan2(-projectedMidpoint.x, projectedMidpoint.z),
  }
}

function RouteMarker({ position }: { position: Vector3 }) {
  const orientation = useMemo(
    () => new Quaternion().setFromUnitVectors(new Vector3(0, 0, 1), position.clone().normalize()),
    [position],
  )

  return (
    <group position={position} quaternion={orientation}>
      <mesh>
        <sphereGeometry args={[0.045, 24, 24]} />
        <meshStandardMaterial color="#ffffff" emissive="#2f7fff" emissiveIntensity={1.5} />
      </mesh>
      <mesh position={[0, 0, 0.008]}>
        <torusGeometry args={[0.075, 0.008, 12, 36]} />
        <meshBasicMaterial color="#63a1ff" transparent opacity={0.75} depthWrite={false} />
      </mesh>
      <pointLight position={[0, 0, 0.1]} color="#4a8dff" intensity={1.4} distance={0.8} />
    </group>
  )
}

function FlightRoute({ path }: { path: JourneyPath }) {
  const routeGeometry = useMemo(() => new TubeGeometry(path.curve, 96, 0.008, 10, false), [path])
  const glowGeometry = useMemo(() => new TubeGeometry(path.curve, 96, 0.026, 10, false), [path])

  useEffect(() => () => {
    routeGeometry.dispose()
    glowGeometry.dispose()
  }, [glowGeometry, routeGeometry])

  return (
    <group>
      <mesh geometry={routeGeometry}>
        <meshBasicMaterial color="#d7e8ff" />
      </mesh>
      <mesh geometry={glowGeometry}>
        <meshBasicMaterial
          color="#2f7fff"
          transparent
          opacity={0.14}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <RouteMarker position={path.start} />
      <RouteMarker position={path.end} />
    </group>
  )
}

function JourneyPlane({ path, reduceMotion }: { path: JourneyPath; reduceMotion: boolean }) {
  const plane = useRef<Group>(null)
  const geometry = useMemo(() => {
    const outline = new Shape()
    outline.moveTo(-0.34, 0)
    outline.lineTo(-0.2, 0.055)
    outline.lineTo(-0.04, 0.07)
    outline.lineTo(0.08, 0.29)
    outline.lineTo(0.15, 0.29)
    outline.lineTo(0.1, 0.065)
    outline.lineTo(0.23, 0.045)
    outline.lineTo(0.28, 0.13)
    outline.lineTo(0.32, 0.13)
    outline.lineTo(0.3, 0)
    outline.lineTo(0.32, -0.13)
    outline.lineTo(0.28, -0.13)
    outline.lineTo(0.23, -0.045)
    outline.lineTo(0.1, -0.065)
    outline.lineTo(0.15, -0.29)
    outline.lineTo(0.08, -0.29)
    outline.lineTo(-0.04, -0.07)
    outline.lineTo(-0.2, -0.055)
    outline.closePath()

    const planeGeometry = new ExtrudeGeometry(outline, {
      depth: 0.045,
      bevelEnabled: true,
      bevelSegments: 2,
      bevelSize: 0.008,
      bevelThickness: 0.008,
    })
    planeGeometry.center()
    return planeGeometry
  }, [])

  const orientation = useMemo(() => new Matrix4(), [])
  const forwardAxis = useMemo(() => new Vector3(), [])
  const sideAxis = useMemo(() => new Vector3(), [])
  const surfaceNormal = useMemo(() => new Vector3(), [])

  useEffect(() => () => geometry.dispose(), [geometry])

  useFrame(({ clock }) => {
    if (!plane.current) return

    const progress = reduceMotion ? 0.55 : (clock.getElapsedTime() % 8) / 8
    const edgeFade = reduceMotion ? 1 : Math.min(1, progress / 0.07, (1 - progress) / 0.07)
    const position = path.curve.getPointAt(progress)
    const tangent = path.curve.getTangentAt(progress).normalize()

    surfaceNormal.copy(position).normalize()
    forwardAxis.copy(tangent).negate().normalize()
    sideAxis.copy(surfaceNormal).cross(forwardAxis).normalize()
    forwardAxis.copy(sideAxis).cross(surfaceNormal).normalize()
    orientation.makeBasis(forwardAxis, sideAxis, surfaceNormal)

    plane.current.position.copy(position)
    plane.current.quaternion.setFromRotationMatrix(orientation)
    plane.current.scale.setScalar(0.7 * Math.max(0.02, edgeFade))
  })

  return (
    <group ref={plane} scale={0.02}>
      <mesh geometry={geometry}>
        <meshStandardMaterial color="#f5f5f2" metalness={0.48} roughness={0.26} />
      </mesh>
      <mesh position={[-0.16, 0, 0.055]} scale={[1.7, 0.7, 0.55]}>
        <sphereGeometry args={[0.038, 20, 20]} />
        <meshStandardMaterial color="#176fd1" metalness={0.7} roughness={0.18} />
      </mesh>
      <pointLight position={[0, 0, 0.14]} color="#5c9dff" intensity={1.8} distance={1.2} />
    </group>
  )
}

function JourneySystem({ targetRotation, reduceMotion }: GlobeProps) {
  const globe = useRef<Group>(null)
  const sourceTexture = useLoader(TextureLoader, "/images/earth-blue-marble.jpg")
  const texture = useMemo(() => {
    const preparedTexture = sourceTexture.clone()
    preparedTexture.colorSpace = SRGBColorSpace
    preparedTexture.anisotropy = 8
    preparedTexture.needsUpdate = true
    return preparedTexture
  }, [sourceTexture])
  const path = useMemo(() => createJourneyPath(), [])

  useEffect(() => () => texture.dispose(), [texture])

  useFrame(() => {
    if (!globe.current) return
    globe.current.rotation.x = reduceMotion
      ? targetRotation
      : MathUtils.lerp(globe.current.rotation.x, targetRotation, 0.08)
  })

  return (
    <group ref={globe} rotation={[0.08, path.yaw, 0]}>
      <mesh>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.72} metalness={0.04} />
      </mesh>
      <mesh scale={1.025}>
        <sphereGeometry args={[EARTH_RADIUS, 64, 64]} />
        <meshBasicMaterial
          color="#3e86ff"
          transparent
          opacity={0.1}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </mesh>
      <FlightRoute path={path} />
      <JourneyPlane path={path} reduceMotion={reduceMotion} />
    </group>
  )
}

function GlobeScene({ targetRotation, reduceMotion }: GlobeProps) {
  return (
    <>
      <ambientLight intensity={0.42} />
      <directionalLight position={[3.5, 2.8, 4]} intensity={2.5} color="#f8fbff" />
      <pointLight position={[-3, -1.5, 2.8]} intensity={8} distance={7} color="#266dff" />
      <JourneySystem targetRotation={targetRotation} reduceMotion={reduceMotion} />
    </>
  )
}

export function MenuJourneyGlobe({ reduceMotion = false }: { reduceMotion?: boolean }) {
  const [rotation, setRotation] = useState(0.08)
  const dragY = useRef<number | null>(null)
  const instructionId = "menu-globe-instruction"

  const adjustRotation = (delta: number) => {
    setRotation((current) => MathUtils.clamp(current + delta, -0.82, 0.82))
  }

  return (
    <div className="menu-globe-stage">
      <span className="menu-globe-shadow" aria-hidden="true" />
      <div
        className="menu-globe-canvas"
        role="slider"
        tabIndex={0}
        aria-label="Rotate the Punjab to Ontario globe vertically"
        aria-describedby={instructionId}
        aria-orientation="vertical"
        aria-valuemin={-47}
        aria-valuemax={47}
        aria-valuenow={Math.round(MathUtils.radToDeg(rotation))}
        onKeyDown={(event) => {
          if (event.key === "ArrowUp") {
            event.preventDefault()
            adjustRotation(-0.12)
          }
          if (event.key === "ArrowDown") {
            event.preventDefault()
            adjustRotation(0.12)
          }
        }}
        onPointerDown={(event) => {
          event.currentTarget.setPointerCapture(event.pointerId)
          dragY.current = event.clientY
        }}
        onPointerMove={(event) => {
          if (dragY.current === null) return
          const delta = event.clientY - dragY.current
          dragY.current = event.clientY
          adjustRotation(delta * 0.008)
        }}
        onPointerUp={() => { dragY.current = null }}
        onPointerCancel={() => { dragY.current = null }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        >
          <Suspense fallback={null}>
            <GlobeScene targetRotation={rotation} reduceMotion={reduceMotion} />
          </Suspense>
        </Canvas>
      </div>
      <span className="menu-globe-label menu-globe-canada"><i />Ontario</span>
      <span className="menu-globe-label menu-globe-punjab">Punjab, India<i /></span>
      <span className="menu-globe-instruction" id={instructionId}>Drag vertically</span>
    </div>
  )
}
