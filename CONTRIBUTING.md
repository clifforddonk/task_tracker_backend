# Contributing Guide

## Branching
- Base branch: `main`
- Feature branches: `feature/<short-desc>`
- Hotfix branches: `hotfix/<short-desc>`

## Commit Style
Use Conventional Commits:
- `feat: add user login`
- `fix: handle jwt token refresh`
- `chore: bump dependencies`

## Pull Requests
- Keep PRs small and focused
- Ensure CI checks are green
- Request at least 1 review
- Link issues using `Closes #123`

## Code Quality
- Python: black, isort, flake8
- JS/TS: eslint, prettier
- Add/Update tests for new changes

## Environment
- Do not commit secrets. Use `.env.example` templates.
- Prefer Docker Compose for parity when possible.
