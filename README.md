# Himil Prajapati | Portfolio

Personal portfolio of Himil Prajapati, a frontend developer working with React and Next.js.

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

## Scroll sequence

The frames in `public/frames` are rendered from the Three.js scene in `scripts/frame-scene.html`. To re-render them:

```bash
npm run frames               # full sequence
npm run frames -- --preview  # five test frames in .frame-preview
```

## Editing content

All text, projects, and links live in `src/content/site.ts`.
