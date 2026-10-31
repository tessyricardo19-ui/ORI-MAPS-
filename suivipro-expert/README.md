# SuiviPro Expert

The accounting-firm edition of SuiviPro: **multi-client bookkeeping** for an accounting practice, with OHADA-oriented reports.

## Features

- Several client files (dossiers) managed from one account
- Invoices, VAT (TVA) and stock tracking
- Balance sheet (bilan) views
- PDF export
- Service worker (`sw.js`) for faster loading and offline use

## Tech stack

HTML, CSS, vanilla JavaScript, Supabase (authentication and database).

## Configuration

`suivipro-expert.html` uses a Supabase project for authentication and data. The original project is offline (free plan expired), so use your own Supabase URL and anon key. The database schema is not included in this repository.

## Run locally

```bash
python3 -m http.server 8080
# open http://localhost:8080/suivipro-expert.html
```

## Author

Ricardo Tessy, Abomey-Calavi, Benin.
