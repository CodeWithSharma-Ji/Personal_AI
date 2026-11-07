import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getUserFromRequest, checkRateLimit } from "@/lib/auth";
import { getModelById } from "@/lib/models";

const GUEST_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

export async function GET(request) {
  const user = await getUserFromRequest(request);
  const { searchParams } = new URL(request.url);
  const rawGuestId = searchParams.get("guestId");
  const guestId = rawGuestId && GUEST_ID_REGEX.test(rawGuestId) ? rawGuestId : null;

  const db = await getDb();
  if (!db) {
    return Response.json({ chats: [] });
  }

  try {
    const chatsCollection = db.collection("chats");
    let query;

    if (user) {
      query = { userId: user.id };
    } else if (guestId) {
      query = { guestId };
    } else {
      return Response.json({ chats: [] });
    }

    const chats = await chatsCollection
      .find(query)
      .sort({ updatedAt: -1 })
      .limit(50)
      .toArray();

    const formatted = chats.map((c) => ({
      id: c._id.toString(),
      title: c.title || "New Conversation",
      model: c.model || "gpt-4o",
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }));

    return Response.json({ chats: formatted });
  } catch (error) {
    console.error("Fetch chats error:", error);
    return Response.json({ error: "Failed to load conversations." }, { status: 500 });
  }
}

export async function POST(request) {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimit = checkRateLimit(`newchat:${clientIp}`, 60, 60 * 1000);
  if (!rateLimit.allowed) {
    return Response.json({ error: "Rate limit exceeded." }, { status: 429 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // Empty body is acceptable
  }

  const user = await getUserFromRequest(request);
  const { title, model, guestId: rawGuestId } = body;

  const guestId = rawGuestId && GUEST_ID_REGEX.test(rawGuestId) ? rawGuestId : "guest";
  const sanitizedTitle = typeof title === "string" ? title.trim().slice(0, 100) : "New Conversation";
  const validatedModel = getModelById(model).id;

  const db = await getDb();
  if (!db) {
    return Response.json({ error: "Database unavailable." }, { status: 503 });
  }

  try {
    const chatsCollection = db.collection("chats");
    const now = new Date();

    const newChat = {
      title: sanitizedTitle,
      model: validatedModel,
      userId: user ? user.id : null,
      guestId: user ? null : guestId,
      createdAt: now,
      updatedAt: now,
    };

    const result = await chatsCollection.insertOne(newChat);

    return Response.json(
      {
        chat: {
          id: result.insertedId.toString(),
          title: newChat.title,
          model: newChat.model,
          createdAt: newChat.createdAt,
          updatedAt: newChat.updatedAt,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create chat error:", error);
    return Response.json({ error: "Failed to initialize conversation." }, { status: 500 });
  }
}
