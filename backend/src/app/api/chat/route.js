const DEFAULT_API_URL = "https://api.openai.com/v1/chat/completions";
const MAX_MESSAGES = 40;
const MAX_MESSAGE_LENGTH = 12000;

export async function POST(request) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { messages } = payload ?? {};
  if (
    !Array.isArray(messages) ||
    messages.length === 0 ||
    messages.length > MAX_MESSAGES ||
    messages.some(
      (message) =>
        !message ||
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        !message.content.trim() ||
        message.content.length > MAX_MESSAGE_LENGTH,
    )
  ) {
    return Response.json({ error: "Conversation messages are invalid." }, { status: 400 });
  }

  const apiKey = process.env.AI_API_KEY === "replace-with-your-provider-key"
    ? undefined
    : process.env.AI_API_KEY;
  const customApiUrl = process.env.AI_API_URL && process.env.AI_API_URL !== DEFAULT_API_URL;

  if (!apiKey && !customApiUrl) {
    return Response.json(
      { error: "Configure AI_API_KEY or AI_API_URL in the backend environment." },
      { status: 503 },
    );
  }

  try {
    const response = await fetch(process.env.AI_API_URL || DEFAULT_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey
          ? { Authorization: `Bearer ${apiKey}` }
          : {}),
      },
      body: JSON.stringify({
        model: process.env.AI_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "You are a helpful personal assistant. Use the conversation history to maintain context.",
          },
          ...messages,
        ],
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!response.ok) {
      return Response.json({ error: "The AI provider could not complete the request." }, { status: 502 });
    }

    const result = await response.json();
    const content = result.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      return Response.json({ error: "The AI provider returned an empty response." }, { status: 502 });
    }

    return Response.json({ reply: content.trim() });
  } catch {
    return Response.json({ error: "Could not reach the AI provider. Check its URL and try again." }, { status: 502 });
  }
}