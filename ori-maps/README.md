# ORI Maps

A mobile-first navigation web app (PWA) built around **ORI codes**: short location codes ("Code BJ") that point to a precise place, so people can navigate to an address even where street names do not exist.

**Live demo:** https://ori-maps.netlify.app/index.html

## Features

- Satellite basemap (ArcGIS imagery) with a light OpenStreetMap overlay, built with [Leaflet](https://leafletjs.com/)
- Search a destination by ORI code
- Turn-by-turn routing through the public OSRM service, with three travel modes: car, motorbike and walking
- Live GPS position tracking with `navigator.geolocation`
- Installable PWA (web manifest and service worker)
- Tap the map to get the ORI code of any point

## Tech stack

HTML, CSS, vanilla JavaScript, Leaflet, Leaflet Routing Machine, OSRM, Service Worker.

## Run locally

No build step. Serve the source folder over HTTP (GPS and service workers need `localhost` or HTTPS):

```bash
cd ori-maps/src
python3 -m http.server 8080
```

`src/` is the source and `dist/` the exported build.

## Context

ORI Maps is part of **POINT229 HUB / SANNG**, a digital addressing project for Benin. This folder contains the front-end prototype. The national backend (Node.js/Express, PostgreSQL/PostGIS, JWT-secured REST API) is a separate, non-public codebase.

## Author

Ricardo Tessy, Abomey-Calavi, Benin. MIT licensed.
