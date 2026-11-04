# Personal AI

Experimental chatbot project with separate Next.js frontend and backend applications.

## Structure

- `frontend/`: Next.js app using the default starter page.
- `backend/`: Next.js app exposing `/api/health` and `/api/chat`.

The frontend rewrites `/api/*` requests to the backend at `http://localhost:3001` by default. The starter page does not currently make API requests; the API proxy can be tested at `http://localhost:3000/api/health`.

## Run locally

```sh
cd backend
npm install
npm run dev
```

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`; the backend runs at `http://localhost:3001`. Set `BACKEND_URL` in the frontend environment to use a different backend address.

To enable `/api/chat`, configure `AI_API_KEY`, `AI_API_URL`, and `AI_MODEL` in `backend/.env.local`. See `backend/.env.example` for defaults. Keep provider credentials on the backend.
