"use client"

import Image from "next/image"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { Maximize2, Pause, Play, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"

type StorySlide = {
  src: string
  label: string
  note: string
  kind?: "image" | "video"
  poster?: string
  displaySeconds?: number
}

const slides: readonly StorySlide[] = [
  { src: "/images/intro-story/story-01.webp", label: "Meet Sukhraj", note: "Curious about what happens behind the screen." },
  { src: "/images/intro-story/story-18.webp", label: "Learning together", note: "Technical communities are built in shared rooms." },
  { src: "/images/intro-story/story-03.webp", label: "How I learn", note: "Start with the system. Follow every connection." },
  { src: "/images/intro-story/story-07.webp", label: "Sharing ideas", note: "Understanding gets stronger when it is explained." },
  { src: "/media/intro-story/story-motion-01.mp4", poster: "/images/intro-story/story-motion-01-poster.webp", kind: "video", label: "Inside the lab", note: "Real infrastructure makes every connection visible." },
  { src: "/images/intro-story/story-04.webp", label: "Network labs", note: "Where diagrams become real infrastructure." },
  { src: "/images/intro-story/story-05.webp", label: "The details", note: "Protocols, packets and the path between them." },
  { src: "/images/intro-story/story-08.webp", label: "Learning out loud", note: "Questions are part of the work." },
  { src: "/images/intro-story/story-06.webp", label: "Troubleshooting", note: "Stay calm. Observe carefully. Change one thing." },
  { src: "/images/intro-story/story-02.webp", label: "People & systems", note: "The best work is rarely done alone." },
  { src: "/images/intro-story/story-17.webp", label: "At Nokia", note: "Learning close to the networks shaping how the world connects." },
  { src: "/images/intro-story/story-09.webp", label: "Room to grow", note: "New environments create new possibilities." },
  { src: "/images/intro-story/story-10.webp", label: "Stay curious", note: "The lab always has another question." },
  { src: "/images/intro-story/story-11.webp", label: "The everyday", note: "Progress is usually quiet and consistent." },
  { src: "/images/intro-story/story-19.webp", label: "A lighter moment", note: "Not every useful moment has to be serious." },
  { src: "/images/intro-story/story-12.webp", label: "Community", note: "The people around the journey matter." },
  { src: "/images/intro-story/story-13.webp", label: "Canada", note: "A new place and more room to build." },
  { src: "/images/intro-story/story-14.webp", label: "Notice the details", note: "Curiosity exists outside technology too." },
  { src: "/media/intro-story/story-motion-02.mp4", poster: "/images/intro-story/story-motion-02-poster.webp", kind: "video", displaySeconds: 1, label: "Creative instinct", note: "Painting, detail and a different kind of focus." },
  { src: "/images/intro-story/story-15.webp", label: "Beyond the terminal", note: "Always up for a match." },
  { src: "/media/intro-story/story-motion-03.mp4", poster: "/images/intro-story/story-motion-03-poster.webp", kind: "video", label: "After hours", note: "A little precision away from the keyboard." },
  { src: "/images/intro-story/story-16.webp", label: "Still creating", note: "Different tools. The same instinct to make." },
]

const captions = [
  { start: 0, end: 10.8, text: "Hi, I’m Sukhraj Singh, and welcome to my little corner of the internet. I’m a Computer Science professional interested in understanding the systems that make technology work behind the scenes." },
  { start: 10.8, end: 21.6, text: "My journey has taken me through networking, Linux, cloud infrastructure, and practical experience with Toys“R”Us, Nokia, and Algoma University." },
  { start: 21.6, end: 29.1, text: "What interests me most is learning how software applications get deployed," },
  { start: 29.1, end: 37, text: "how networks communicate, and how infrastructure can be automated and made more reliable." },
  { start: 37, end: 50.5, text: "Along the way, I’ve worked with technologies like AWS, Terraform, Docker, Linux, GitHub Actions, Python, and more." },
] as const

const DEFAULT_DURATION = 50.5

function formatTime(value: number) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0
  const minutes = Math.floor(safeValue / 60)
  const seconds = Math.floor(safeValue % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function IntroStory() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const visualVideoRef = useRef<HTMLVideoElement>(null)
  const figureRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(false)
  const [captionsOn, setCaptionsOn] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(DEFAULT_DURATION)

  const timeline = useMemo(() => {
    const fixedSeconds = slides.reduce((total, slide) => total + (slide.displaySeconds ?? 0), 0)
    const flexibleCount = slides.filter((slide) => slide.displaySeconds === undefined).length
    const flexibleSeconds = Math.max(.1, (duration - fixedSeconds) / Math.max(1, flexibleCount))
    return slides.reduce<Array<{ start: number; end: number }>>((entries, slide) => {
      const start = entries.at(-1)?.end ?? 0
      const slideDuration = slide.displaySeconds ?? flexibleSeconds
      const entry = { start, end: start + slideDuration }
      return entries.concat(entry)
    }, [])
  }, [duration])
  const timelineIndex = timeline.findIndex((entry) => progress < entry.end)
  const activeIndex = timelineIndex === -1 ? slides.length - 1 : timelineIndex
  const activeSlide = slides[activeIndex]
  const caption = useMemo(
    () => captions.find((cue) => progress >= cue.start && progress < cue.end)?.text,
    [progress],
  )

  useEffect(() => {
    const nextSlide = slides[Math.min(activeIndex + 1, slides.length - 1)]
    if (nextSlide.kind === "video") {
      const preload = document.createElement("video")
      preload.preload = "metadata"
      preload.src = nextSlide.src
    } else {
      const preload = new window.Image()
      preload.src = nextSlide.src
    }
  }, [activeIndex])

  useEffect(() => {
    const video = visualVideoRef.current
    if (!video) return

    if (playing && !reduceMotion) {
      void video.play()
    } else {
      video.pause()
    }
  }, [activeIndex, playing, reduceMotion])

  const togglePlayback = async () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      if (audio.ended) audio.currentTime = 0
      await audio.play()
    } else {
      audio.pause()
    }
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setMuted(audio.muted)
  }

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setProgress(value)
  }

  const moveSlide = (direction: -1 | 1) => {
    const nextIndex = Math.min(slides.length - 1, Math.max(0, activeIndex + direction))
    seek(timeline[nextIndex].start + 0.01)
  }

  const enterFullscreen = async () => {
    if (figureRef.current?.requestFullscreen) await figureRef.current.requestFullscreen()
  }

  const progressPercent = Math.min(100, (progress / Math.max(duration, 0.1)) * 100)

  return (
    <figure
      ref={figureRef}
      className={`intro-video intro-story${playing ? " is-playing" : ""}${progress > 0 ? " has-started" : ""}`}
    >
      <audio
        ref={audioRef}
        src="/media/sukhraj-story.m4a"
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration || DEFAULT_DURATION)}
        onTimeUpdate={(event) => setProgress(event.currentTarget.currentTime)}
      >
        <track kind="captions" src="/media/sukhraj-intro.vtt" srcLang="en" label="English" />
      </audio>

      <div className="intro-story-stage" onClick={togglePlayback}>
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activeSlide.src}
            className="intro-story-frame"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 1.045 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: .985 }}
            transition={{ duration: reduceMotion ? .15 : 1.15, ease: [.22, 1, .36, 1] }}
          >
            {activeSlide.kind === "video" ? (
              <video
                ref={visualVideoRef}
                src={activeSlide.src}
                poster={activeSlide.poster}
                aria-label={`${activeSlide.label}: a short muted moment from Sukhraj Singh’s journey`}
                autoPlay={playing && !reduceMotion}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image
                src={activeSlide.src}
                alt={`${activeSlide.label}: a moment from Sukhraj Singh’s journey`}
                fill
                priority={activeIndex === 0}
                sizes="(max-width: 900px) 100vw, 520px"
              />
            )}
          </motion.div>
        </AnimatePresence>

        <div className="intro-story-shade" aria-hidden="true" />

        <div className="intro-story-topline">
          <span className={playing ? "story-sound is-live" : "story-sound"}>
            <i aria-hidden="true" /> Voice introduction
          </span>
          <span className="story-top-actions">
            <span>{String(activeIndex + 1).padStart(2, "0")} / {slides.length}</span>
            {playing ? (
              <button
                className="story-live-pause"
                type="button"
                onClick={(event) => { event.stopPropagation(); void togglePlayback() }}
                aria-label="Pause introduction"
              >
                <Pause size={14} fill="currentColor" />
              </button>
            ) : null}
          </span>
        </div>

        {!playing && progress === 0 ? (
          <button
            className="intro-play story-play"
            type="button"
            onClick={(event) => { event.stopPropagation(); void togglePlayback() }}
            aria-label={`Hear my story, ${formatTime(duration)}, with sound`}
          >
            <span><Play size={18} fill="currentColor" aria-hidden="true" /></span>
            <strong>Hear my story</strong>
            <small>{formatTime(duration)}</small>
          </button>
        ) : null}

        {!playing && progress > 0 ? (
          <>
            <button
              className="story-skip story-skip-back"
              type="button"
              onClick={(event) => { event.stopPropagation(); moveSlide(-1) }}
              aria-label="Previous photo"
              disabled={activeIndex === 0}
            >
              <SkipBack size={16} fill="currentColor" />
            </button>
            <button
              className="story-skip story-skip-forward"
              type="button"
              onClick={(event) => { event.stopPropagation(); moveSlide(1) }}
              aria-label="Next photo"
              disabled={activeIndex === slides.length - 1}
            >
              <SkipForward size={16} fill="currentColor" />
            </button>
          </>
        ) : null}

        {progress > 0 && !captionsOn ? (
          <div className="intro-story-copy">
            <p>{activeSlide.label}</p>
            <span>{activeSlide.note}</span>
          </div>
        ) : null}

        {captionsOn && caption ? <p className="story-caption">{caption}</p> : null}
      </div>

      <div className="story-progress" aria-hidden="true">
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      {!playing && progress > 0 ? (
        <div className="video-controls story-controls" aria-label="Photo story controls">
          <button type="button" onClick={togglePlayback} aria-label="Play introduction">
            <Play size={16} fill="currentColor" />
          </button>
          <span className="story-time">{formatTime(progress)}</span>
          <input
            aria-label="Introduction progress"
            type="range"
            min="0"
            max={duration || DEFAULT_DURATION}
            step="0.1"
            value={progress}
            onChange={(event) => seek(Number(event.target.value))}
          />
          <span className="story-time">−{formatTime(Math.max(0, duration - progress))}</span>
          <button type="button" onClick={toggleMute} aria-label={muted ? "Unmute introduction" : "Mute introduction"}>
            {muted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <button type="button" onClick={() => setCaptionsOn((value) => !value)} aria-label={`${captionsOn ? "Hide" : "Show"} English captions`} aria-pressed={captionsOn}>
            <span aria-hidden="true">CC</span>
          </button>
          <button type="button" onClick={enterFullscreen} aria-label="View photo story fullscreen">
            <Maximize2 size={16} />
          </button>
        </div>
      ) : null}

      <figcaption>
        <span>My story · In my own voice</span>
        <span>{playing ? "Now playing" : "Play with sound"}</span>
      </figcaption>
      <details className="intro-transcript">
        <summary>Read the introduction transcript</summary>
        <div>
          {captions.map((cue) => <p key={cue.start}>{cue.text}</p>)}
        </div>
      </details>
    </figure>
  )
}
