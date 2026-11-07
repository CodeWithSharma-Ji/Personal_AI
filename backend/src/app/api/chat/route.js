import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getUserFromRequest, isValidObjectId, checkRateLimit } from "@/lib/auth";
import { generateDefinedModelResponse, getModelById } from "@/lib/models";

const DEFAULT_API_URL = "https://api.openai.com/v1/chat/completions";
const MAX_MESSAGES = 60;
const MAX_MESSAGE_LENGTH = 15000;
const GUEST_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

export async function POST(request) {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  
  // Rate limiting: 30 requests per minute per client IP
  const rateLimit = checkRateLimit(`chat:${clientIp}`, 30, 60 * 1000);
  if (!rateLimit.allowed) {
    return Response.json(
      { error: `Rate limit reached. Please wait ${rateLimit.resetInSeconds}s.` },
      { status: 429 }
    );
  }

  let payload;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { messages, model: requestedModel = "gpt-4o", chatId, guestId: rawGuestId } = payload ?? {};
  const user = await getUserFromRequest(request);
  const guestId = rawGuestId && GUEST_ID_REGEX.test(rawGuestId) ? rawGuestId : "guest";

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
    return Response.json({ error: "Conversation payload is invalid." }, { status: 400 });
  }

  const activeModel = getModelById(requestedModel);
  const userLatestMessage = messages[messages.length - 1];

  let currentChatId = isValidObjectId(chatId) ? chatId : null;
  const db = await getDb();

  // If chatId is provided, ensure existence and check permissions in MongoDB
  if (db && currentChatId) {
    try {
      const existingChat = await db.collection("chats").findOne({ _id: new ObjectId(currentChatId) });
      if (existingChat) {
        // Ownership check
        if (existingChat.userId && (!user || existingChat.userId !== user.id)) {
          return Response.json({ error: "Unauthorized access to thread." }, { status: 403 });
        }

        await db.collection("messages").insertOne({
          chatId: currentChatId,
          role: userLatestMessage.role,
          content: userLatestMessage.content,
          model: activeModel.id,
          createdAt: new Date(),
        });
      } else {
        currentChatId = null; // Create new if not found
      }
    } catch (e) {
      console.warn("Could not append user message:", e.message);
    }
  }

  // Create new thread if needed
  if (db && !currentChatId) {
    try {
      const cleanContent = userLatestMessage.content.replace(/\s+/g, " ").trim();
      const title = cleanContent.slice(0, 36) + (cleanContent.length > 36 ? "..." : "");
      const now = new Date();

      const insertChat = await db.collection("chats").insertOne({
        title,
        model: activeModel.id,
        userId: user ? user.id : null,
        guestId: user ? null : guestId,
        createdAt: now,
        updatedAt: now,
      });
      currentChatId = insertChat.insertedId.toString();

      await db.collection("messages").insertOne({
        chatId: currentChatId,
        role: userLatestMessage.role,
        content: userLatestMessage.content,
        model: activeModel.id,
        createdAt: now,
      });
    } catch (e) {
      console.warn("Could not create chat entry:", e.message);
    }
  }

  // Upstream Inference Execution
  const apiKey = process.env.AI_API_KEY === "replace-with-your-provider-key" ? undefined : process.env.AI_API_KEY;
  const customApiUrl = process.env.AI_API_URL && process.env.AI_API_URL !== DEFAULT_API_URL;

  let assistantReply = "";

  if (apiKey || customApiUrl) {
    try {
      const response = await fetch(process.env.AI_API_URL || DEFAULT_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(apiKey ? { Authorization: `Bearer ${apiKey}` } : {}),
        },
        body: JSON.stringify({
          model: activeModel.id,
          messages: [
            {
              role: "system",
              content: `You are ${activeModel.name}. Provide direct, articulate, well-structured responses.`,
            },
            ...messages,
          ],
        }),
        signal: AbortSignal.timeout(45000),
      });

      if (response.ok) {
        const result = await response.json();
        const content = result.choices?.[0]?.message?.content;
        if (typeof content === "string" && content.trim()) {
          assistantReply = content.trim();
        }
      }
    } catch (err) {
      console.warn("Upstream provider unavailable, using defined engine:", err.message);
    }
  }

  if (!assistantReply) {
    assistantReply = generateDefinedModelResponse(activeModel.id, messages);
  }

  // Persist assistant message
  if (db && currentChatId && isValidObjectId(currentChatId)) {
    try {
      const now = new Date();
      await db.collection("messages").insertOne({
        chatId: currentChatId,
        role: "assistant",
        content: assistantReply,
        model: activeModel.id,
        createdAt: now,
      });

      await db.collection("chats").updateOne(
        { _id: new ObjectId(currentChatId) },
        {
          $set: {
            updatedAt: now,
            model: activeModel.id,
          },
        }
      );
    } catch (e) {
      console.warn("Could not persist assistant message:", e.message);
    }
  }

  return Response.json({
    reply: assistantReply,
    model: activeModel.id,
    modelName: activeModel.name,
    chatId: currentChatId,
  });
}
