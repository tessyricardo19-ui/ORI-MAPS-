# Cauri Rush

A 3D browser game set in Benin: race through **10 cities**, beat **9 bosses**, pick one of **4 heroes**. Play solo or race friends with a room code. Installable as a PWA and playable offline in solo mode.

**Live demo:** https://caurirush.netlify.app/

## Features

- Lightweight 3D engine written from scratch in WebGL2 (`g3.js`, no dependencies): cartoon shading and instanced primitives
- 3D models and scenery built from basic shapes (`w3.js`), with an automatic fallback to the 2D renderer when WebGL2 is not available
- Three difficulty levels (easy, normal, expert)
- Multiplayer races between friends with a room code (Supabase Realtime)
- Fon-language voice lines for defeated bosses and enemies
- PWA: installable, with a service worker for offline solo play

## Tech stack

Vanilla JavaScript, WebGL2, Supabase (realtime rooms), Service Worker, Web App Manifest.

## Configuration

Multiplayer needs a Supabase project: set your own `SUPABASE_URL` and `SUPABASE_KEY` (anon key) in `index.html`. Solo mode works without it.

## Run locally

```bash
python3 -m http.server 8080
```

Installing as an app requires HTTPS (Netlify, GitHub Pages, etc.). See `LISEZMOI.txt` for the French notes.

## Author

Ricardo Tessy, Abomey-Calavi, Benin.
