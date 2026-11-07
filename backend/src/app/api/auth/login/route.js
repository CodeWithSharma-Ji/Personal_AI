import { getDb } from "@/lib/mongodb";
import { verifyPassword, generateToken, checkRateLimit } from "@/lib/auth";

export async function POST(request) {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "127.0.0.1";

  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  const { identifier, password } = body ?? {};

  if (!identifier || typeof identifier !== "string" || !identifier.trim() || identifier.length > 100) {
    return Response.json({ error: "Please enter your username or email." }, { status: 400 });
  }

  if (!password || typeof password !== "string" || password.length > 128) {
    return Response.json({ error: "Password is required." }, { status: 400 });
  }

  const trimmedId = identifier.trim().toLowerCase();

  // Rate limiting against brute force attacks
  const rateLimitKey = `login:${clientIp}:${trimmedId}`;
  const rateLimit = checkRateLimit(rateLimitKey, 6, 5 * 60 * 1000); // 6 attempts per 5 minutes
  if (!rateLimit.allowed) {
    return Response.json(
      { error: `Too many login attempts. Please wait ${rateLimit.resetInSeconds}s before trying again.` },
      { status: 429 }
    );
  }

  const db = await getDb();
  if (!db) {
    return Response.json({ error: "Database service unavailable." }, { status: 503 });
  }

  try {
    const usersCollection = db.collection("users");

    // Exact lowercase matching avoids ReDoS and injection vulnerabilities
    const user = await usersCollection.findOne({
      $or: [
        { email: trimmedId },
        { usernameLower: trimmedId },
        { username: trimmedId },
      ],
    });

    if (!user || !user.passwordHash || !user.salt) {
      return Response.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const isValid = verifyPassword(password, user.passwordHash, user.salt, user.iterations);
    if (!isValid) {
      return Response.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const userId = user._id.toString();
    const token = generateToken({
      userId,
      username: user.username,
      email: user.email,
    });

    return Response.json({
      token,
      user: {
        id: userId,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return Response.json({ error: "Authentication failed." }, { status: 500 });
  }
}
