import { execFileSync, spawn } from "node:child_process"
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

const portfolioRoot = resolve(import.meta.dirname, "..")
const moodifyRoot = process.env.MOODIFY_FRONTEND_ROOT || "C:\\Users\\HP\\Desktop\\Moodify\\frontend"
const chromePath = process.env.MOODIFY_CHROME_PATH || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
const toolingRoot = process.env.PORTFOLIO_VIDEO_TOOLING_ROOT

if (!existsSync(chromePath)) throw new Error(`Chrome was not found at ${chromePath}`)
if (!existsSync(join(moodifyRoot, ".next"))) throw new Error("Build Moodify before recording it.")
if (!toolingRoot) throw new Error("Set PORTFOLIO_VIDEO_TOOLING_ROOT to a folder containing ffmpeg-static.")

const require = createRequire(import.meta.url)
const ffmpeg = require(join(toolingRoot, "node_modules", "ffmpeg-static"))
const outputPath = join(portfolioRoot, "public", "video", "moodify-controlled-local-demo.mp4")
const posterPath = join(portfolioRoot, "public", "images", "projects", "moodify-controlled-local-demo.jpg")
const temporaryRoot = mkdtempSync(join(tmpdir(), "moodify-capture-"))
const profilePath = join(temporaryRoot, "chrome-profile")
const sourceFramesPath = join(temporaryRoot, "source-frames")
const videoFramesPath = join(temporaryRoot, "video-frames")
const width = 1920
const height = 1080
const fps = 30
const captureDurationMs = 26_000
const appPort = 3210
const appUrl = `http://127.0.0.1:${appPort}/dashboard`

for (const path of [profilePath, sourceFramesPath, videoFramesPath, dirname(outputPath), dirname(posterPath)]) {
  mkdirSync(path, { recursive: true })
}

const songs = [
  {
    track_id: "fixture-focus-flow",
    title: "Focus Flow",
    artist: "Controlled Demo",
    duration: "3:42",
    score: 8,
    emotion: "happy",
    album_art: null,
    emotion_breakdown: { happy: 5, sad: 0, angry: 0, surprise: 2, fear: 0, disgust: 0, neutral: 1 },
  },
  {
    track_id: "fixture-quiet-hours",
    title: "Quiet Hours",
    artist: "Local Fixture",
    duration: "4:08",
    score: 6,
    emotion: "neutral",
    album_art: null,
    emotion_breakdown: { happy: 2, sad: 1, angry: 0, surprise: 0, fear: 0, disgust: 0, neutral: 4 },
  },
  {
    track_id: "fixture-night-drive",
    title: "Night Drive",
    artist: "Demo Session",
    duration: "3:18",
    score: 5,
    emotion: "surprise",
    album_art: null,
    emotion_breakdown: { happy: 3, sad: 0, angry: 0, surprise: 4, fear: 0, disgust: 0, neutral: 0 },
  },
]

let webcamActive = false
let currentTrack = 0
let playbackProgress = 58_000

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

async function waitForHttp(url, timeoutMs = 25_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {}
    await delay(200)
  }
  throw new Error(`Timed out waiting for ${url}`)
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

function responseHeaders(contentType = "application/json") {
  return [
    { name: "Content-Type", value: contentType },
    { name: "Access-Control-Allow-Origin", value: `http://127.0.0.1:${appPort}` },
    { name: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
    { name: "Access-Control-Allow-Headers", value: "Content-Type" },
    { name: "Cache-Control", value: "no-store" },
  ]
}

function encodedBody(value) {
  const text = typeof value === "string" ? value : JSON.stringify(value)
  return Buffer.from(text).toString("base64")
}

async function handleMockRequest(cdp, event) {
  const { requestId, request } = event
  const url = new URL(request.url)
  const path = url.pathname

  if (request.method === "OPTIONS") {
    await cdp.send("Fetch.fulfillRequest", {
      requestId,
      responseCode: 204,
      responseHeaders: responseHeaders(),
      body: "",
    })
    return
  }

  let body = { ok: true }
  let contentType = "application/json"

  if (path === "/api/auth/status") body = { authenticated: true }
  else if (path === "/api/enjoyed-songs") body = { songs }
  else if (path === "/api/webcam/status") body = { webcam_active: webcamActive, current_emotion: webcamActive ? "happy" : null }
  else if (path === "/api/webcam/start") {
    webcamActive = true
    body = { message: "Webcam started", webcam_active: true }
  } else if (path === "/api/webcam/stop") {
    webcamActive = false
    body = { message: "Webcam stopped", webcam_active: false }
  } else if (path === "/api/analyze-situation") {
    await delay(900)
    body = { sentiment: "focused", keyword: "deep work", situation: "I need something calm while I finish this project." }
  } else if (path === "/api/play-music") {
    await delay(900)
    body = { message: "Prepared a controlled five-track fixture", tracks: songs }
  } else if (path === "/api/current-playback") {
    playbackProgress = Math.min(playbackProgress + 2_000, 208_000)
    const selected = songs[currentTrack]
    body = {
      is_playing: true,
      track: {
        id: selected.track_id,
        name: selected.title,
        artists: [selected.artist],
        album: "Moodify controlled session",
        album_art: null,
        duration_ms: 222_000,
        progress_ms: playbackProgress,
        uri: `spotify:track:${selected.track_id}`,
      },
      device: { name: "Local browser fixture", type: "Computer" },
    }
  } else if (path === "/api/playback/state") body = { shuffle_state: false, repeat_state: "off" }
  else if (path === "/api/playback/next") {
    currentTrack = (currentTrack + 1) % songs.length
    playbackProgress = 7_000
    body = { message: "Skipped to next controlled track" }
  } else if (path === "/api/face-distance") body = { distance_cm: 64, volume: 62 }
  else if (path === "/api/adjust-volume") body = { distance_cm: 64, volume: 62 }
  else if (path === "/api/db-updates") {
    contentType = "text/event-stream"
    body = "data: {\"type\":\"connected\"}\n\n"
  }

  await cdp.send("Fetch.fulfillRequest", {
    requestId,
    responseCode: 200,
    responseHeaders: responseHeaders(contentType),
    body: encodedBody(body),
  })
}

async function evaluate(cdp, expression) {
  return cdp.send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true })
}

async function waitForExpression(cdp, expression, timeoutMs = 20_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const result = await evaluate(cdp, expression)
    if (result.result.value) return
    await delay(150)
  }
  throw new Error(`Timed out waiting for browser expression: ${expression}`)
}

async function clickButton(cdp, text) {
  const escaped = JSON.stringify(text)
  await evaluate(
    cdp,
    `(() => { const button = [...document.querySelectorAll('button')].find((item) => item.textContent.includes(${escaped})); if (!button) return false; button.click(); return true })()`,
  )
}

async function typeSituation(cdp, value) {
  const words = value.split(" ")
  let current = ""
  for (const word of words) {
    current = current ? `${current} ${word}` : word
    await evaluate(
      cdp,
      `(() => { const input = document.querySelector('input[placeholder^="Tell us"]'); if (!input) return false; const setter = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set; setter.call(input, ${JSON.stringify(current)}); input.dispatchEvent(new Event('input', { bubbles: true })); input.focus(); return true })()`,
    )
    await delay(125)
  }
}

function materializeFrames(sourceFrames) {
  if (sourceFrames.length < 2) throw new Error(`Chrome only produced ${sourceFrames.length} screencast frame(s).`)
  const totalFrames = Math.ceil((captureDurationMs / 1000) * fps)
  let sourceIndex = 0
  for (let outputIndex = 0; outputIndex < totalFrames; outputIndex += 1) {
    const targetTime = outputIndex / fps
    while (sourceIndex + 1 < sourceFrames.length && sourceFrames[sourceIndex + 1].time <= targetTime) sourceIndex += 1
    copyFileSync(sourceFrames[sourceIndex].path, join(videoFramesPath, `${String(outputIndex).padStart(6, "0")}.jpg`))
  }
  copyFileSync(join(videoFramesPath, `${String(Math.round(13.5 * fps)).padStart(6, "0")}.jpg`), posterPath)
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
      "-an",
      outputPath,
    ],
    { stdio: "inherit" },
  )
}

let appServer
let chrome
let cdp

try {
  appServer = spawn(
    process.execPath,
    [join(moodifyRoot, "node_modules", "next", "dist", "bin", "next"), "start", "-p", String(appPort)],
    { cwd: moodifyRoot, stdio: "ignore", windowsHide: true },
  )
  await waitForHttp(appUrl)

  chrome = spawn(
    chromePath,
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--no-first-run",
      "--no-default-browser-check",
      "--remote-debugging-port=0",
      `--user-data-dir=${profilePath}`,
      `--window-size=${width},${height}`,
      "about:blank",
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
  await cdp.send("Fetch.enable", {
    patterns: [
      { urlPattern: "http://localhost:5001/*", requestStage: "Request" },
      { urlPattern: "http://127.0.0.1:5001/*", requestStage: "Request" },
    ],
  })
  cdp.on("Fetch.requestPaused", (event) => void handleMockRequest(cdp, event))
  await cdp.send("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false })
  await cdp.send("Page.navigate", { url: appUrl })
  await waitForExpression(cdp, "document.body && document.body.innerText.includes('Welcome Back!')")
  await evaluate(
    cdp,
    `(() => { const badge = document.createElement('div'); badge.textContent = 'CONTROLLED LOCAL DEMO / EXTERNAL APIS STUBBED'; badge.style.cssText = 'position:fixed;z-index:9999;right:24px;top:76px;padding:9px 13px;border-radius:999px;background:#eefbf3;color:#0f6b36;border:1px solid #9ee0b7;font:600 10px ui-monospace,Consolas,monospace;letter-spacing:.08em;box-shadow:0 8px 30px rgba(0,0,0,.18)'; document.body.appendChild(badge); return true })()`,
  )

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

  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 90, maxWidth: width, maxHeight: height, everyNthFrame: 1 })
  await delay(2_000)
  await clickButton(cdp, "Start Camera")
  await delay(2_300)
  await clickButton(cdp, "Off")
  await delay(2_500)
  await typeSituation(cdp, "I need something calm while I finish this project.")
  await delay(600)
  await clickButton(cdp, "Analyze")
  await delay(2_100)
  await clickButton(cdp, "Play Music")
  await delay(1_800)
  await evaluate(cdp, `(() => { const target = [...document.querySelectorAll('div')].find((item) => item.children.length === 1 && item.textContent.trim() === 'Happy'); target?.click(); return Boolean(target) })()`)
  await delay(1_400)
  await evaluate(cdp, `([...document.querySelectorAll('h2')].find((item) => item.textContent.includes('Top Songs'))?.scrollIntoView({ behavior: 'smooth', block: 'center' }), true)`)
  await delay(2_600)
  await evaluate(cdp, `(() => { const target = [...document.querySelectorAll('span')].find((item) => item.textContent.trim() === 'Next'); target?.closest('button')?.click(); return Boolean(target) })()`)
  await delay(3_200)
  await evaluate(cdp, `([...document.querySelectorAll('h2')].find((item) => item.textContent.includes('How are you feeling'))?.scrollIntoView({ behavior: 'smooth', block: 'center' }), true)`)
  await delay(4_200)
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
  if (appServer && !appServer.killed) appServer.kill()
  await delay(300)
  if (existsSync(temporaryRoot) && temporaryRoot.startsWith(tmpdir())) rmSync(temporaryRoot, { recursive: true, force: true })
}
