# Internal Task Tracker

This repo tracks the internal tasks given to the interns.

## Tech Stack

- Backend: Django (Python)
- Frontend: Next.js (React)
- Database: PostgreSQL
- CI/CD: GitHub Actions

## Quick Start

```bash
# Backend
cd backend
cp .env.example .env
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

# Frontend
cd ../frontend
cp .env.example .env.local
npm install
npm run dev
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Security

See [SECURITY.md](SECURITY.md).
