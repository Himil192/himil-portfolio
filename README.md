# Himil Prajapati | Portfolio

[![CI](https://github.com/Himil192/himil-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/Himil192/himil-portfolio/actions/workflows/ci.yml)

Personal portfolio of Himil Prajapati, a frontend developer working with React and Next.js.

Live site: https://himil-portfolio.vercel.app

## Deployment

Every push and pull request to `main` runs lint, type checks, a production build, and a dependency audit in GitHub Actions. Vercel deploys `main` to production and creates a preview link for each branch.

## Stack

- Next.js (static export), React, TypeScript, Tailwind CSS
- Three.js and React Three Fiber for live GLSL shader surfaces
- GSAP ScrollTrigger and Lenis for scroll motion
- Playwright and sharp for rendering the scroll sequence to WebP frames

## Run it

```bash
npm install
npm run dev      # development server
npm run build    # static export to out/
npm start        # serve out/
npm run lint
```

Set `NEXT_PUBLIC_SITE_URL` to the live domain when building for production, so share previews, the sitemap, and `robots.txt` point to it.

## Scroll sequence

The frames in `public/frames` are rendered from the Three.js scene in `scripts/frame-scene.html`. To re-render them:

```bash
npm run frames               # full sequence
npm run frames -- --preview  # five test frames in .frame-preview
```

## Editing content

All text, projects, and links live in `src/content/site.ts`.
