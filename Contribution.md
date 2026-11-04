# Contributing to Personal AI

Thank you for your interest in contributing to Personal AI. This document outlines the development workflow, coding standards, and pull request process for this project.

---

## Branching Policy

- Work should be done on a dedicated feature or bugfix branch.
- Use descriptive branch names with appropriate prefixes:
  - `feat/feature-name` for new features or capabilities
  - `fix/bug-description` for bug fixes
  - `refactor/component-name` for code restructuring
  - `docs/topic-name` for documentation updates
- Keep your branch updated with the base branch before opening a pull request.

---

## Development Setup

1. **Clone the repository**:
   ```sh
   git clone git@github.com:CodeWithSharma-Ji/Personal_AI.git
   cd Personal_AI
   ```

2. **Check out your target branch**:
   ```sh
   git checkout feature-1
   git checkout -b feat/your-feature-name
   ```

3. **Install dependencies for both apps**:
   ```sh
   cd backend && npm install
   cd ../frontend && npm install
   ```

4. **Set up local environment variables**:
   - Copy `backend/.env.example` to `backend/.env.local`.
   - Add your API key or configure a local model endpoint.
   - Do not commit `.env.local` files to Git.

---

## Development Guidelines

### Project Separation
- The repository contains two independent Next.js projects: `frontend/` and `backend/`.
- Frontend code belongs in `frontend/src/`.
- Backend endpoints and server logic belong in `backend/src/`.
- Do not mix frontend UI components into the backend, and never expose backend credentials or private API keys in the frontend.

### Code Style & Quality
- Write clean, readable, and standard JavaScript / JSX.
- Follow Next.js App Router conventions for routes and server handlers.
- Run the linter in each package before committing:
  ```sh
  cd backend && npm run lint
  cd frontend && npm run lint
  ```
- Ensure both applications build successfully without compilation errors:
  ```sh
  cd backend && npm run build
  cd frontend && npm run build
  ```

### Handling Secrets
- Never commit API keys, tokens, or credentials to version control.
- Ensure any new environment variables are documented with placeholder values in `backend/.env.example` or the README.

---

## Testing Changes Locally

Before submitting your changes, verify functionality locally:

1. **Verify Backend Health**:
   Start the backend (`npm run dev` in `backend/`) and ensure `GET http://localhost:3001/api/health` returns `{"status": "ok"}`.
2. **Verify API Proxy**:
   Start the frontend (`npm run dev` in `frontend/`) and ensure `GET http://localhost:3000/api/health` proxies successfully.
3. **Verify Chat Route**:
   Send a sample request to `POST http://localhost:3000/api/chat` with valid JSON payload and verify expected behavior and error handling.

---

## Commit Guidelines

Use concise, imperative commit messages summarizing the change:

- `feat: implement chat conversation interface`
- `fix: handle timeout error when calling provider API`
- `docs: update environment variable instructions`
- `refactor: clean up message validation helper`

---

## Pull Request Process

1. Push your branch to the remote repository:
   ```sh
   git push origin feat/your-feature-name
   ```
2. Open a Pull Request targeting the designated branch (e.g. `feature-1` or `main`).
3. Fill out the pull request description:
   - **Summary**: Concise description of changes made.
   - **Reason**: Problem being solved or feature being added.
   - **Testing**: Steps taken to verify that the changes work as expected.
4. Ensure all automated checks (linting, build) pass.
5. Address any review comments or requested changes promptly.
