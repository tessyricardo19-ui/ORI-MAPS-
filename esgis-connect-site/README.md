# ESGIS Connect

A mobile-first web app that gives students their **timetable by study track and level**, with student accounts and an admin role.

## Features

- Student sign-up and login
- Timetable organised by track (filière) and level (niveau)
- Admin role to manage content
- Installable PWA with a service worker, manifest and icons

## Tech stack

HTML, CSS, vanilla JavaScript, Supabase (authentication and database), Service Worker.

## Configuration

`index.html` connects to a Supabase project. The original hosted demo is offline because its free plan expired, so use your own Supabase URL and anon key.

## Run locally

```bash
python3 -m http.server 8080
```

## Author

Ricardo Tessy, Abomey-Calavi, Benin.
