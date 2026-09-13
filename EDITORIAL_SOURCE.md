# Editorial portfolio source

The verified August 24, 2026 production deployment is preserved in `site/`. Vercel publishes that directory as a static site so later Git commits cannot silently replace the editorial design with the repository's older Next.js template.

## Added flagship projects

- DeployGuard Cloud Platform: `/projects/deployguard-cloud-platform`
- SignalDesk AI: `/projects/signaldesk-ai`

Both entries include a project-index card, a detailed case study, a GitHub repository link, a poster, and a recorded working demo.

## Local verification

```bash
node tools/preview-server.mjs
```

Open `http://localhost:4173/projects`. The augmentation script is idempotent and can regenerate the two project pages:

```bash
python tools/augment_editorial.py
```

The static source intentionally preserves the assets and interaction bundles from the verified deployment. `custom.css` and `static.js` provide the two new project surfaces and clean full-page navigation between recovered routes.
