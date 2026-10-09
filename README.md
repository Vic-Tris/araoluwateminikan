# Araoluwa | Our Constellation

A React, TypeScript, Vite, and Three.js birthday experience.

## Run locally

```sh
npm ci
npm run dev
```

## Private media

Personal photos, videos, and audio are intentionally excluded from this public repository. To restore the complete experience locally:

- Put the twelve relationship photos in `public/images/` using the filenames referenced in `src/data/constellation.ts`.
- Add `ambient-space.mp3` and `secret-reveal.mp3` to `public/audio/` to enable both soundtracks.

The media directories are ignored by Git so personal files are not accidentally committed.

## Production build

```sh
npm run build
npm run preview
```
