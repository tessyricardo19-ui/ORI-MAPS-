# SuiviPro

A single-page **CRM and OHADA-compliant accounting** web app for small businesses in West Africa.

## Features

- Accounts with e-mail/password or Google sign-in
- Client management
- Quotes (devis) and invoices (factures)
- VAT (TVA) handling
- Financial tracking and balance sheet (bilan) views following SYSCOHADA rules
- Charts for financial follow-up

## Tech stack

HTML, CSS, vanilla JavaScript, Supabase (authentication and database), a chart library for dashboards.

## Configuration

The Supabase URL and anon key in `index.html` are placeholders (`https://YOUR-PROJECT.supabase.co`, `YOUR_SUPABASE_ANON_KEY`). Put your own project values there. The original hosted demo is offline because its free Supabase plan expired, and the database schema is not included in this repository.

## Run locally

```bash
python3 -m http.server 8080
```

## Author

Ricardo Tessy, Abomey-Calavi, Benin.
