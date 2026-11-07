import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { getUserFromRequest, isValidObjectId } from "@/lib/auth";

const GUEST_ID_REGEX = /^[a-zA-Z0-9_-]{1,64}$/;

export async function GET(request, { params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return Response.json({ error: "Invalid conversation ID." }, { status: 400 });
  }

  const user = await getUserFromRequest(request);
  const { searchParams } = new URL(request.url);
  const rawGuestId = searchParams.get("guestId");
  const guestId = rawGuestId && GUEST_ID_REGEX.test(rawGuestId) ? rawGuestId : null;

  const db = await getDb();
  if (!db) {
    return Response.json({ error: "Database service unavailable." }, { status: 503 });
  }

  try {
    const chat = await db.collection("chats").findOne({ _id: new ObjectId(id) });
    if (!chat) {
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    }

    // Ownership check: logged-in user or matching guest ID
    if (chat.userId) {
      if (!user || chat.userId !== user.id) {
        return Response.json({ error: "Unauthorized access." }, { status: 403 });
      }
    } else if (chat.guestId) {
      if (!guestId || chat.guestId !== guestId) {
        return Response.json({ error: "Unauthorized access." }, { status: 403 });
      }
    }

    const messages = await db
      .collection("messages")
      .find({ chatId: id })
      .sort({ createdAt: 1 })
      .limit(200)
      .toArray();

    return Response.json({
      chat: {
        id: chat._id.toString(),
        title: chat.title,
        model: chat.model,
      },
      messages: messages.map((m) => ({
        id: m._id.toString(),
        role: m.role,
        content: m.content,
        model: m.model,
        timestamp: new Date(m.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    });
  } catch (error) {
    console.error("Fetch chat messages error:", error);
    return Response.json({ error: "Failed to load messages." }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  if (!isValidObjectId(id)) {
    return Response.json({ error: "Invalid conversation ID." }, { status: 400 });
  }

  const user = await getUserFromRequest(request);
  const { searchParams } = new URL(request.url);
  const rawGuestId = searchParams.get("guestId");
  const guestId = rawGuestId && GUEST_ID_REGEX.test(rawGuestId) ? rawGuestId : null;

  const db = await getDb();
  if (!db) {
    return Response.json({ error: "Database service unavailable." }, { status: 503 });
  }

  try {
    const chat = await db.collection("chats").findOne({ _id: new ObjectId(id) });
    if (!chat) {
      return Response.json({ error: "Conversation not found." }, { status: 404 });
    }

    if (chat.userId) {
      if (!user || chat.userId !== user.id) {
        return Response.json({ error: "Unauthorized." }, { status: 403 });
      }
    } else if (chat.guestId) {
      if (!guestId || chat.guestId !== guestId) {
        return Response.json({ error: "Unauthorized." }, { status: 403 });
      }
    }

    await db.collection("chats").deleteOne({ _id: new ObjectId(id) });
    await db.collection("messages").deleteMany({ chatId: id });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Delete chat error:", error);
    return Response.json({ error: "Failed to delete conversation." }, { status: 500 });
  }
}
