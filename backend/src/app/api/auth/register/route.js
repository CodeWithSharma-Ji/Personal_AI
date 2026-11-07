import { getDb } from "@/lib/mongodb";
import { hashPassword, generateToken, checkRateLimit } from "@/lib/auth";

const USERNAME_REGEX = /^[a-zA-Z0-9_-]{2,30}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request) {
  // Rate limiting by client IP
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";
  const rateLimit = checkRateLimit(`register:${clientIp}`, 10, 60 * 60 * 1000); // 10 per hour
  if (!rateLimit.allowed) {
    return Response.json(
      { error: `Too many registration attempts. Please try again in ${rateLimit.resetInSeconds}s.` },
      { status: 429 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { username, email, password } = body ?? {};

  if (!username || typeof username !== "string" || !USERNAME_REGEX.test(username.trim())) {
    return Response.json(
      { error: "Username must be 2-30 characters and contain only letters, numbers, hyphens or underscores." },
      { status: 400 }
    );
  }

  if (!email || typeof email !== "string" || email.length > 100 || !EMAIL_REGEX.test(email.trim().toLowerCase())) {
    return Response.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  if (!password || typeof password !== "string" || password.length < 6) {
    return Response.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  if (password.length > 128) {
    return Response.json({ error: "Password cannot exceed 128 characters." }, { status: 400 });
  }

  const trimmedUsername = username.trim();
  const usernameLower = trimmedUsername.toLowerCase();
  const trimmedEmail = email.trim().toLowerCase();

  const db = await getDb();
  if (!db) {
    return Response.json({ error: "Database service unavailable." }, { status: 503 });
  }

  try {
    const usersCollection = db.collection("users");

    // Check if user already exists using exact indexed lowercase matching
    const existing = await usersCollection.findOne({
      $or: [{ email: trimmedEmail }, { usernameLower }, { username: trimmedUsername }],
    });

    if (existing) {
      if (existing.email === trimmedEmail) {
        return Response.json({ error: "An account with this email already exists." }, { status: 409 });
      }
      return Response.json({ error: "Username is already taken." }, { status: 409 });
    }

    const { hash, salt, iterations } = hashPassword(password);
    const now = new Date();

    const insertResult = await usersCollection.insertOne({
      username: trimmedUsername,
      usernameLower,
      email: trimmedEmail,
      passwordHash: hash,
      salt,
      iterations,
      createdAt: now,
      updatedAt: now,
    });

    const userId = insertResult.insertedId.toString();
    const token = generateToken({ userId, username: trimmedUsername, email: trimmedEmail });

    return Response.json(
      {
        token,
        user: {
          id: userId,
          username: trimmedUsername,
          email: trimmedEmail,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return Response.json({ error: "Failed to create user account." }, { status: 500 });
  }
}
