# Sukhraj Singh — Portfolio

A multi-page personal portfolio for Sukhraj Singh, built as an editorial view of his work in DevOps, cloud infrastructure, networking, automation and systems.

Live site: [portfolio-singhsukhraj.vercel.app](https://portfolio-singhsukhraj.vercel.app)

## Stack

- Next.js 16 App Router and TypeScript
- Tailwind CSS 4 with a custom editorial design system
- Framer Motion for navigation, reveal and route motion
- Lucide React and Vercel Analytics

## Local setup

```bash
corepack pnpm install
corepack pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Quality commands

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

## Structure

```text
app/          Routes, metadata, sitemap and global styles
components/   Layout, media, motion, project and skills components
data/         Projects, experience, skills, education and social links
lib/          Shared metadata, motion and class helpers
public/       Optimized images and intro media
```

## Updating content

- Edit personal links and site metadata in `data/site.ts`.
- The bottom-left portfolio guide answers in the visitor's browser using `data/guide.ts` and the project catalogue. Keep résumé facts in sync with `public/Sukhraj-Singh-Resume.pdf`; differing dates are identified explicitly rather than silently reconciled. Unknown questions point visitors to direct contact. Chat messages are not sent to an AI service or saved across reloads.
- The homepage encouragement card uses original messages in `data/encouragement.ts`. Append new messages to keep existing IDs stable. A browser-local history prevents repeats until the set is exhausted, including across refreshes; after that, a new cycle starts without repeating the previous message. Separate visitors have independently randomized sequences.
- Add or update project case studies in `data/projects.ts`; the `/projects/[slug]` pages are generated from this file.
- Runnable-project demos are configured beside their case-study data. Store real local-execution H.264 MP4 recordings in `public/video/` and matching WebP posters in `public/images/projects/`. Research or design-only entries should not be presented as working demos until executable source is available.
- `scripts/generate-project-demos.mjs` rebuilds the motion walkthroughs when `PORTFOLIO_VIDEO_TOOLING_ROOT` points to a tooling folder containing `sharp` and `ffmpeg-static`.
- Update roles, skills and credentials in their matching files under `data/`.
- The homepage photo story uses images from `public/images/intro-story/`, muted motion clips from `public/media/intro-story/`, narration from `public/media/voice.m4a`, and captions from `public/media/sukhraj-intro.vtt`.
- Replace the clearly labelled painting placeholders only when real artwork is supplied.
- The SCAMPA/ScamShield Phase 1 report is stored at `public/research/scamshield-phase-1.pdf`; keep the case study explicit about the boundary between the completed architecture report and planned implementation.
- The SCAMPA case study also includes a separate interactive portfolio reconstruction at `public/labs/scampa/`. `scripts/capture-scampa-demo.mjs` records that real browser interaction at 1080p and combines it with the local controlled-caller and desktop-TTS fixtures. It must remain labelled as a reconstruction, not as the deleted Phase 2 showcase.
- `scripts/capture-moodify-demo.mjs` records the real Moodify repository frontend against controlled contract-shaped API fixtures. Keep the demo labelled accordingly: it verifies the dashboard interaction, not live Spotify, Gemini, MongoDB or webcam services.

## Deployment

The local directory is linked to the existing Vercel project. Run `vercel deploy` for a preview and `vercel deploy --prod` only after the checks above pass.
