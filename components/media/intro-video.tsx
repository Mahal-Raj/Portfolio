"use client"

import { useRef, useState } from "react"
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react"

export function IntroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(50)

  const togglePlayback = async () => {
    const video = videoRef.current
    if (!video) return
    if (video.paused) {
      video.muted = false
      setMuted(false)
      await video.play()
    } else {
      video.pause()
    }
  }

  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    video.muted = !video.muted
    setMuted(video.muted)
  }

  const seek = (value: number) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = value
    setProgress(value)
  }

  const toggleCaptions = () => {
    const track = videoRef.current?.textTracks[0]
    if (!track) return
    const next = !captionsOn
    track.mode = next ? "showing" : "hidden"
    setCaptionsOn(next)
  }

  const enterFullscreen = async () => {
    const video = videoRef.current
    if (video?.requestFullscreen) await video.requestFullscreen()
  }

  return (
    <figure className={playing ? "intro-video is-playing" : "intro-video"}>
      <video
        ref={videoRef}
        src="/media/sukhraj-intro.mp4?v=mouth-detail-4-1080"
        poster="/images/sukhraj-intro-poster.jpg"
        muted={muted}
        playsInline
        preload="metadata"
        onClick={togglePlayback}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
      >
        <track kind="captions" src="/media/sukhraj-intro.vtt" srcLang="en" label="English" />
        Your browser does not support embedded video.
      </video>

      {!playing && progress === 0 ? (
        <button className="intro-play" type="button" onClick={togglePlayback} aria-label="Play my introduction video with sound">
          <span><Play size={18} fill="currentColor" aria-hidden="true" /></span>
          <strong>Meet Sukhraj</strong>
          <small>00:50</small>
        </button>
      ) : null}

      <div className="video-controls" aria-label="Video controls">
        <button type="button" onClick={togglePlayback} aria-label={playing ? "Pause introduction" : "Play introduction"}>
          {playing ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
        </button>
        <input
          aria-label="Video progress"
          type="range"
          min="0"
          max={duration || 50}
          step="0.1"
          value={progress}
          onChange={(event) => seek(Number(event.target.value))}
        />
        <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute introduction" : "Mute introduction"}>
          {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </button>
        <button type="button" onClick={toggleCaptions} aria-label={`${captionsOn ? "Hide" : "Show"} English captions`} aria-pressed={captionsOn}>
          <span aria-hidden="true">CC</span>
        </button>
        <button type="button" onClick={enterFullscreen} aria-label="View introduction fullscreen">
          <Maximize2 size={16} />
        </button>
      </div>

      <figcaption>
        <span>Introduction · Sukhraj Singh</span>
        <span>Play with sound</span>
      </figcaption>
    </figure>
  )
}
