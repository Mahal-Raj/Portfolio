import { spawn, execFileSync } from "node:child_process"
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs"
import { tmpdir } from "node:os"
import { dirname, join, resolve } from "node:path"
import { createRequire } from "node:module"

const root = resolve(import.meta.dirname, "..")
const chromePath = process.env.SCAMPA_CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const toolingRoot = process.env.PORTFOLIO_VIDEO_TOOLING_ROOT

if (!existsSync(chromePath)) throw new Error(`Chrome was not found at ${chromePath}`)
if (!toolingRoot) throw new Error("Set PORTFOLIO_VIDEO_TOOLING_ROOT to a folder containing ffmpeg-static.")

const require = createRequire(import.meta.url)
const ffmpeg = require(join(toolingRoot, "node_modules", "ffmpeg-static"))
const outputPath = join(root, "public", "video", "scamshield-reconstructed-local-demo.mp4")
const posterPath = join(root, "public", "images", "projects", "scamshield-reconstructed-local-demo.jpg")
const callerAudio = join(root, "public", "labs", "scampa", "audio", "controlled-caller.wav")
const agentAudio = join(root, "public", "labs", "scampa", "audio", "safe-agent-response.wav")
const demoUrl = `file:///${join(root, "public", "labs", "scampa", "index.html").replaceAll("\\", "/")}`
const captureDurationMs = 41_000
const fps = 30
const width = 1920
const height = 1080
const callerDelayMs = 1_700
const agentDelayMs = 20_400
const temporaryRoot = mkdtempSync(join(tmpdir(), "scampa-capture-"))
const profilePath = join(temporaryRoot, "chrome-profile")
const sourceFramesPath = join(temporaryRoot, "source-frames")
const videoFramesPath = join(temporaryRoot, "video-frames")
const silentVideoPath = join(temporaryRoot, "silent.mp4")

for (const path of [profilePath, sourceFramesPath, videoFramesPath, dirname(outputPath), dirname(posterPath)]) {
  mkdirSync(path, { recursive: true })
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds))
}

async function waitForFile(path, timeoutMs = 15_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    if (existsSync(path)) return
    await delay(100)
  }
  throw new Error(`Timed out waiting for ${path}`)
}

async function waitForPage(port, timeoutMs = 15_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/json/list`)
      const targets = await response.json()
      const page = targets.find((target) => target.type === "page")
      if (page?.webSocketDebuggerUrl) return page
    } catch {}
    await delay(150)
  }
  throw new Error("Timed out waiting for the Chrome page target.")
}

function createCdpClient(url) {
  const socket = new WebSocket(url)
  const pending = new Map()
  const listeners = new Map()
  let nextId = 1

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data)
    if (message.id) {
      const request = pending.get(message.id)
      if (!request) return
      pending.delete(message.id)
      if (message.error) request.reject(new Error(message.error.message))
      else request.resolve(message.result)
      return
    }
    for (const listener of listeners.get(message.method) || []) listener(message.params)
  })

  return {
    ready: new Promise((resolveReady, rejectReady) => {
      socket.addEventListener("open", resolveReady, { once: true })
      socket.addEventListener("error", rejectReady, { once: true })
    }),
    send(method, params = {}) {
      return new Promise((resolveRequest, rejectRequest) => {
        const id = nextId++
        pending.set(id, { resolve: resolveRequest, reject: rejectRequest })
        socket.send(JSON.stringify({ id, method, params }))
      })
    },
    on(method, listener) {
      const current = listeners.get(method) || []
      current.push(listener)
      listeners.set(method, current)
    },
    close() {
      socket.close()
    },
  }
}

function materializeFrames(sourceFrames) {
  if (sourceFrames.length < 2) throw new Error(`Chrome only produced ${sourceFrames.length} screencast frame(s).`)
  const totalFrames = Math.ceil((captureDurationMs / 1000) * fps)
  let sourceIndex = 0

  for (let outputIndex = 0; outputIndex < totalFrames; outputIndex += 1) {
    const targetTime = outputIndex / fps
    while (
      sourceIndex + 1 < sourceFrames.length &&
      sourceFrames[sourceIndex + 1].time <= targetTime
    ) {
      sourceIndex += 1
    }
    copyFileSync(sourceFrames[sourceIndex].path, join(videoFramesPath, `${String(outputIndex).padStart(6, "0")}.jpg`))
  }

  const posterFrame = Math.min(totalFrames - 1, Math.round(15.8 * fps))
  copyFileSync(join(videoFramesPath, `${String(posterFrame).padStart(6, "0")}.jpg`), posterPath)
  return totalFrames
}

function encodeVideo() {
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "warning",
      "-framerate",
      String(fps),
      "-i",
      join(videoFramesPath, "%06d.jpg"),
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "20",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      silentVideoPath,
    ],
    { stdio: "inherit" },
  )

  execFileSync(
    ffmpeg,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "warning",
      "-i",
      silentVideoPath,
      "-i",
      callerAudio,
      "-i",
      agentAudio,
      "-filter_complex",
      `[1:a]adelay=${callerDelayMs}:all=1,volume=0.88[caller];[2:a]adelay=${agentDelayMs}:all=1,volume=0.88[agent];[caller][agent]amix=inputs=2:duration=longest:dropout_transition=0[audio]`,
      "-map",
      "0:v:0",
      "-map",
      "[audio]",
      "-c:v",
      "copy",
      "-c:a",
      "aac",
      "-b:a",
      "160k",
      "-movflags",
      "+faststart",
      outputPath,
    ],
    { stdio: "inherit" },
  )
}

let chrome
let cdp

try {
  chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--autoplay-policy=no-user-gesture-required",
      "--remote-debugging-port=0",
      `--user-data-dir=${profilePath}`,
      `--window-size=${width},${height}`,
      demoUrl,
    ],
    { stdio: "ignore", windowsHide: true },
  )

  const devtoolsPortPath = join(profilePath, "DevToolsActivePort")
  await waitForFile(devtoolsPortPath)
  const [port] = readFileSync(devtoolsPortPath, "utf8").trim().split(/\r?\n/)
  const page = await waitForPage(port)
  cdp = createCdpClient(page.webSocketDebuggerUrl)
  await cdp.ready
  await cdp.send("Page.enable")
  await cdp.send("Runtime.enable")
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: false,
  })

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const state = await cdp.send("Runtime.evaluate", { expression: "document.readyState", returnByValue: true })
    if (state.result.value === "complete") break
    await delay(100)
  }

  const sourceFrames = []
  let firstTimestamp
  let sourceFrameIndex = 0
  cdp.on("Page.screencastFrame", (frame) => {
    if (firstTimestamp === undefined) firstTimestamp = frame.metadata.timestamp
    const path = join(sourceFramesPath, `${String(sourceFrameIndex).padStart(6, "0")}.jpg`)
    sourceFrameIndex += 1
    writeFileSync(path, Buffer.from(frame.data, "base64"))
    sourceFrames.push({ path, time: frame.metadata.timestamp - firstTimestamp })
    void cdp.send("Page.screencastFrameAck", { sessionId: frame.sessionId })
  })

  await cdp.send("Page.startScreencast", {
    format: "jpeg",
    quality: 90,
    maxWidth: width,
    maxHeight: height,
    everyNthFrame: 1,
  })
  await delay(800)
  await cdp.send("Runtime.evaluate", { expression: "window.SCAMPADemo.start()" })
  await delay(captureDurationMs - 800)
  await cdp.send("Page.stopScreencast")
  await delay(400)

  const frameCount = materializeFrames(sourceFrames)
  encodeVideo()
  console.log(`Captured ${sourceFrames.length} browser frames and materialized ${frameCount} frames.`)
  console.log(outputPath)
  console.log(posterPath)
} finally {
  cdp?.close()
  if (chrome && !chrome.killed) chrome.kill()
  await delay(300)
  if (existsSync(temporaryRoot) && temporaryRoot.startsWith(tmpdir())) {
    rmSync(temporaryRoot, { recursive: true, force: true })
  }
}
