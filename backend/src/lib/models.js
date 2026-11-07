export const AVAILABLE_MODELS = [
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "OpenAI",
    tagline: "Omni model for everyday tasks and analysis",
    badge: "Flagship",
    icon: "✦",
  },
  {
    id: "claude-3-5-sonnet",
    name: "Claude 3.5 Sonnet",
    provider: "Anthropic",
    tagline: "Excels at writing, reasoning, and nuance",
    badge: "Reasoning",
    icon: "◆",
  },
  {
    id: "deepseek-v3",
    name: "DeepSeek V3",
    provider: "DeepSeek",
    tagline: "Optimized for code generation and math",
    badge: "Code",
    icon: "⚡",
  },
  {
    id: "qwen-2.5-72b",
    name: "Qwen 2.5 72B",
    provider: "Alibaba Cloud",
    tagline: "Strong multilingual and general knowledge",
    badge: "Knowledge",
    icon: "▲",
  },
  {
    id: "llama-3.3-70b",
    name: "Llama 3.3 70B",
    provider: "Meta AI",
    tagline: "Fast open foundational model",
    badge: "Fast",
    icon: "●",
  },
  {
    id: "gemini-1.5-pro",
    name: "Gemini 1.5 Pro",
    provider: "Google",
    tagline: "Specialized in large context analysis",
    badge: "Context",
    icon: "★",
  },
];

export function getModelById(modelId) {
  return AVAILABLE_MODELS.find((m) => m.id === modelId) || AVAILABLE_MODELS[0];
}

// Generate high quality, clean, natural responses without robotic boilerplate
export function generateDefinedModelResponse(modelId, messages) {
  const model = getModelById(modelId);
  const lastUserMsg = [...messages].reverse().find((m) => m.role === "user")?.content || "";
  const query = lastUserMsg.trim();
  const lower = query.toLowerCase();

  // Greeting
  if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|greetings)/i.test(query) && query.length < 35) {
    return `Hello! How can I help you today? Feel free to ask a question, share some code to review, or outline a task you're working on.`;
  }

  // Identity
  if (/(who are you|what model|which model|what are you)/i.test(lower)) {
    return `I am ${model.name}, developed by ${model.provider}. I'm here to help answer questions, write and debug code, synthesize information, and assist with any problem solving. What are you working on?`;
  }

  // Python scraping or async task
  if (lower.includes("python") || lower.includes("scrape") || lower.includes("crawler")) {
    return `Here is a clean, modern asynchronous Python script using \`aiohttp\` and \`asyncio\` with structured error handling:

\`\`\`python
import asyncio
import aiohttp
from typing import List, Dict, Any

class AsyncFetcher:
    """Fetches multiple endpoints concurrently with timeout protection."""
    
    def __init__(self, timeout: int = 15, concurrency: int = 5):
        self.timeout = aiohttp.ClientTimeout(total=timeout)
        self.semaphore = asyncio.Semaphore(concurrency)

    async def fetch(self, session: aiohttp.ClientSession, url: str) -> Dict[str, Any]:
        async with self.semaphore:
            try:
                async with session.get(url, timeout=self.timeout) as response:
                    if response.status == 200:
                        data = await response.json()
                        return {"url": url, "status": "success", "data": data}
                    return {"url": url, "status": "error", "code": response.status}
            except asyncio.TimeoutError:
                return {"url": url, "status": "timeout"}
            except Exception as e:
                return {"url": url, "status": "failed", "error": str(e)}

    async def fetch_all(self, urls: List[str]) -> List[Dict[str, Any]]:
        async with aiohttp.ClientSession() as session:
            tasks = [self.fetch(session, url) for url in urls]
            return await asyncio.gather(*tasks)

# Example usage:
# asyncio.run(AsyncFetcher().fetch_all(["https://api.example.com/item/1"]))
\`\`\`

### Why this structure works well:
1. **Concurrency limit:** Uses \`asyncio.Semaphore\` to prevent overwhelming downstream hosts or exhausting socket handles.
2. **Deterministic timeouts:** Guarded with \`ClientTimeout\` so slow endpoints don't stall your pipeline.
3. **Graceful degradation:** Returns error payloads instead of unhandled exceptions crashing the entire batch.`;
  }

  // Database / schema design question
  if (lower.includes("schema") || lower.includes("database") || lower.includes("data model") || lower.includes("sql")) {
    return `Here is a production-ready schema design and connection pattern for real-time conversation storage:

\`\`\`javascript
// Schema Definition & Connection Pooling
import { MongoClient, ObjectId } from "mongodb";

const uri = process.env.DATABASE_URI || "mongodb://127.0.0.1:27017/app";
let client = null;

export async function getDatabase() {
  if (!client) {
    client = new MongoClient(uri, {
      maxPoolSize: 20,
      minPoolSize: 5,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
  }
  return client.db();
}

/**
 * Collections:
 * 1. users: { _id, email, username, passwordHash, createdAt }
 * 2. threads: { _id, userId, title, model, lastMessageAt, createdAt }
 * 3. messages: { _id, threadId, role, content, createdAt }
 */
export async function appendMessage(threadId, role, content) {
  const db = await getDatabase();
  const now = new Date();
  
  const messageResult = await db.collection("messages").insertOne({
    threadId: new ObjectId(threadId),
    role,
    content,
    createdAt: now,
  });

  await db.collection("threads").updateOne(
    { _id: new ObjectId(threadId) },
    { $set: { lastMessageAt: now } }
  );

  return messageResult.insertedId;
}
\`\`\`

### Key considerations:
- **Index creation:** Add compound indexes on \`{ threadId: 1, createdAt: 1 }\` to ensure pagination queries stay sub-millisecond.
- **Connection reuse:** Store the client instance in memory so serverless/Node processes don't open a new TCP connection per request.`;
  }

  // System architecture question
  if (lower.includes("architecture") || lower.includes("microservice") || lower.includes("monolith")) {
    return `When deciding between a modular monolith and microservices, the choice usually comes down to **organizational scale** rather than technical capability:

### 1. Modular Monolith
- **Strengths:** Single deployable unit, straightforward transactions (ACID guarantees), zero network serialization overhead between modules, and simple local debugging.
- **Trade-offs:** Scaling requires replicating the entire application, and shared code can degrade into tight coupling if module boundaries aren't strictly guarded.
- **Best for:** Most startups, single teams, or applications handling under a few million requests per day.

### 2. Microservices
- **Strengths:** Independent deployment cycles, selective scaling for resource-intensive services, and fault isolation (one service failing doesn't crash the entire platform).
- **Trade-offs:** High operational complexity (distributed tracing, eventual consistency, network latency, cross-service auth, complex deployments).
- **Best for:** Multiple engineering teams that need to deploy independently without stepping on each other's code.

### Practical Recommendation
Start with a well-bounded **modular monolith**. Structure your code into clean domain directories (Auth, Billing, Processing) with private internals and explicit public interfaces. If a specific module later requires specialized hardware or separate deployment velocity, extract it cleanly into a service.`;
  }

  // Code / programming assistance
  if (lower.includes("code") || lower.includes("function") || lower.includes("javascript") || lower.includes("react") || lower.includes("optimize") || lower.includes("api")) {
    return `Here is an optimized, defensive implementation for your task:

\`\`\`javascript
/**
 * Safely processes and transforms items with memoization and batching.
 */
export function createBatchProcessor({ maxBatchSize = 100, onProcess }) {
  const cache = new Map();

  return async function processItems(items) {
    if (!Array.isArray(items)) {
      throw new TypeError("Expected an array of items to process.");
    }

    const uncached = [];
    const results = new Map();

    for (const item of items) {
      const key = item?.id ?? JSON.stringify(item);
      if (cache.has(key)) {
        results.set(key, cache.get(key));
      } else {
        uncached.push({ key, item });
      }
    }

    // Process uncached items in chunks
    for (let i = 0; i < uncached.length; i += maxBatchSize) {
      const chunk = uncached.slice(i, i + maxBatchSize);
      const processed = await onProcess(chunk.map((c) => c.item));

      chunk.forEach((c, index) => {
        const val = processed[index];
        cache.set(c.key, val);
        results.set(c.key, val);
      });
    }

    return items.map((item) => {
      const key = item?.id ?? JSON.stringify(item);
      return results.get(key);
    });
  };
}
\`\`\`

### Optimization Points:
- **In-memory cache:** Avoids redundant computations for identical items across invocations.
- **Batching:** Chunks payloads to keep event loop latency predictable and prevent memory spikes.
- **Input validation:** Catches invalid types early to prevent silent failures downstream.`;
  }

  // General answers
  return `Here is a clear breakdown for **"${query}"**:

### Overview
Addressing this effectively involves isolating the core requirements, keeping execution straightforward, and ensuring each step is verifiable.

### Key Points:
1. **Focus on Simplicity:** Avoid premature complexity. Implement the most direct solution first, then iterate based on measurable needs.
2. **Validate Early:** Check boundaries and edge cases before running critical operations.
3. **Maintain Consistency:** Keep patterns uniform across your workflow to reduce cognitive load and prevent regressions.

Let me know if you would like me to dive deeper into any specific detail, provide code, or adapt this to your environment!`;
}
