# FLAKE — ZJARR

Landing page and cash-on-delivery store for FLAKE. Built with React, TypeScript, Tailwind CSS v4 and Motion.

## Run

```bash
npm install
cp .env.example .env   # then paste your Web3Forms access key
npm run dev
```

`npm run build` outputs a static site to `dist/` that can be deployed to any static host (Vercel, Netlify, Cloudflare Pages).

## Orders

Orders are sent through [Web3Forms](https://web3forms.com) to the inbox the access key is registered with. Set `VITE_WEB3FORMS_ACCESS_KEY` in `.env` locally and in your host's environment settings for production. Web3Forms keys are meant to be used from the browser; the env var keeps the key out of source control. Without a key, the form shows a friendly "temporarily unavailable" error instead of failing silently.

Each order email includes a reference (`FLK-XXXXX`), product, colour, size, quantity, total, customer details and "Cash on Delivery".

## Assets

- `clothes/` holds the original high-resolution photos (source only, not served).
- `public/products/` holds web-optimised WebP versions (1400px, plus a 640px `-sm` copy).
  - `signature-front/` is the shared front used by both **Red Flags** and **I Don't Care**.
  - Hasta La Vista has no male back shot in black, so the viewer disables "Back" for that photo.
- `flakeshoots/` holds the original campaign photos; `public/campaign/` holds the web versions used in the Campaign strip, About and Order sections.
- The ember film behind the About section is streamed from Cloudinary (see `src/components/About.tsx`) and loads only when scrolled near.
- `public/media/` holds the hero film, re-encoded from the Dropbox original (720p for phones, 1080p otherwise). The Dropbox `raw=1` URL is kept as a fallback source.
- `fire.png` is the logo and favicon.

Product data, copy and the image mapping live in `src/data/products.ts`.
