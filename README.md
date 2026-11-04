# Personal AI

Personal AI is a full-stack chatbot application built with Next.js. The project uses a decoupled architecture with separate frontend and backend applications to keep provider credentials secure and isolate client-side UI from API routing and upstream integrations.

## Architecture

The project consists of two distinct Next.js applications:

- **Frontend (`frontend/`)**: Next.js client application styled with Tailwind CSS. It serves the user interface and proxies API traffic (`/api/*`) to the backend service via Next.js rewrites.
- **Backend (`backend/`)**: Next.js API application running on port 3001. It handles authentication with upstream AI providers, request validation, and chat completion processing.

```text
+--------------------------+           +--------------------------+           +----------------------+
|  Frontend (Next.js)      |  /api/*   |  Backend (Next.js)       |   HTTPS   |  AI Provider         |
|  http://localhost:3000   | --------> |  http://localhost:3001   | --------> |  (OpenAI / Custom)   |
+--------------------------+  rewrite  +--------------------------+           +----------------------+
```

### Why Decoupled?

Keeping the backend separate ensures that sensitive provider API keys (`AI_API_KEY`) and custom model endpoints remain on the server and are never exposed to browser clients.

---

## Project Structure

```text
.
├── backend/
│   ├── src/app/
│   │   ├── api/
│   │   │   ├── chat/route.js      # Handles chat completions and validation
│   │   │   └── health/route.js    # Health check and configuration status
│   │   ├── layout.jsx
│   │   └── page.jsx               # Backend status landing page
│   ├── .env.example               # Template for backend environment variables
│   ├── next.config.mjs            # Backend Next.js configuration
│   └── package.json               # Backend dependencies and scripts
│
├── frontend/
│   ├── src/app/
│   │   ├── globals.css            # Tailwind CSS styling
│   │   ├── layout.jsx
│   │   └── page.jsx               # Main UI starter page
│   ├── next.config.mjs            # Frontend configuration with /api rewrite proxy
│   └── package.json               # Frontend dependencies and scripts
│
├── Contribution.md                # Contribution guidelines
└── README.md                      # Project documentation
```

---

## Prerequisites

Before running the project, make sure you have installed:

- **Node.js**: v18.18.0 or later (v20+ recommended)
- **npm**: v9 or later (bundled with Node.js)
- An API key for OpenAI or any OpenAI-compatible API provider (e.g., Groq, Ollama, self-hosted LLM endpoints)

---

## Environment Variables

### Backend Configuration

The backend requires configuration to communicate with the AI provider. Create a `.env.local` file inside the `backend/` directory based on `backend/.env.example`:

```sh
cp backend/.env.example backend/.env.local
```

Configure the following variables in `backend/.env.local`:

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `AI_API_KEY` | Your AI provider API key. Required unless using a local endpoint that does not require authentication. | `replace-with-your-provider-key` |
| `AI_API_URL` | Upstream chat completions URL. Must follow the OpenAI completions format. | `https://api.openai.com/v1/chat/completions` |
| `AI_MODEL` | Target model identifier. | `gpt-4o-mini` |

> Never commit `backend/.env.local` to version control.

### Frontend Configuration

By default, the frontend forwards all `/api/*` requests to `http://localhost:3001`. If your backend runs on a different port or host, create `frontend/.env.local` and set:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `BACKEND_URL` | Base URL of the backend service. | `http://localhost:3001` |

---

## Getting Started

Run both applications locally in separate terminal windows.

### 1. Start the Backend

In your first terminal, install dependencies and start the backend development server:

```sh
cd backend
npm install
npm run dev
```

The backend server starts at **`http://localhost:3001`**.

Verify the backend is running by opening `http://localhost:3001/api/health` in your browser or running:

```sh
curl http://localhost:3001/api/health
```

### 2. Start the Frontend

In your second terminal, install dependencies and start the frontend development server:

```sh
cd frontend
npm install
npm run dev
```

The frontend server starts at **`http://localhost:3000`**.

Because the frontend proxies `/api/*` requests, you can verify the proxy connection by visiting:

```sh
curl http://localhost:3000/api/health
```

---

## API Reference

### Health Check

- **Endpoint**: `GET /api/health`
- **Description**: Returns server operational status and indicates if the AI provider credentials or custom endpoints are configured.

#### Response

```json
{
  "status": "ok",
  "assistantConfigured": true
}
```

### Chat Completions

- **Endpoint**: `POST /api/chat`
- **Description**: Accepts a conversation history array and returns an assistant response generated by the configured model.

#### Request Headers

```http
Content-Type: application/json
```

#### Request Body

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how can you help me today?"
    }
  ]
}
```

#### Payload Rules & Constraints

- `messages`: Required array of message objects (1 to 40 items).
- `role`: Must be either `"user"` or `"assistant"`.
- `content`: Non-empty string, maximum 12,000 characters per message.

#### Successful Response (`200 OK`)

```json
{
  "reply": "Hello! I am your personal assistant. How can I help you today?"
}
```

#### Error Responses

| Status Code | Reason | Example Response |
| :--- | :--- | :--- |
| `400 Bad Request` | Invalid JSON or malformed messages payload | `{"error": "Conversation messages are invalid."}` |
| `502 Bad Gateway` | Upstream provider error, empty completion, or network failure | `{"error": "The AI provider could not complete the request."}` |
| `503 Service Unavailable` | Backend lacks API key or provider endpoint configuration | `{"error": "Configure AI_API_KEY or AI_API_URL in the backend environment."}` |

#### Example cURL

```sh
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      { "role": "user", "content": "What is 2 + 2?" }
    ]
  }'
```

---

## Available Scripts

### Backend (`cd backend`)

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the backend development server on port 3001 |
| `npm run build` | Builds the production bundle |
| `npm run start` | Starts the production server on port 3001 |
| `npm run lint` | Runs ESLint across backend files |

### Frontend (`cd frontend`)

| Command | Action |
| :--- | :--- |
| `npm run dev` | Starts the frontend development server on port 3000 |
| `npm run build` | Builds the production bundle |
| `npm run start` | Starts the production server on port 3000 |
| `npm run lint` | Runs ESLint across frontend files |

---

## Contributing

See [Contribution.md](Contribution.md) for guidelines on code standards, local development workflows, and submitting pull requests.
