import crypto from "crypto";
import { ObjectId } from "mongodb";
import { getDb } from "./mongodb";

const TOKEN_SECRET = process.env.AUTH_SECRET || "personal-ai-secure-auth-secret-key-2026";
const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEYLEN = 64;
const PBKDF2_DIGEST = "sha512";

// In-memory sliding-window rate limiter
const rateLimitMap = new Map();

/**
 * Enforces in-memory rate limiting per key (e.g. IP or username).
 * Returns { allowed: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(key, maxRequests = 10, windowMs = 60000) {
  const now = Date.now();
  const record = rateLimitMap.get(key) || { timestamps: [] };

  // Remove timestamps outside window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= maxRequests) {
    const oldest = record.timestamps[0];
    const resetInSeconds = Math.ceil((windowMs - (now - oldest)) / 1000);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  record.timestamps.push(now);
  rateLimitMap.set(key, record);

  // Periodic cleanup of stale keys
  if (rateLimitMap.size > 2000) {
    for (const [k, v] of rateLimitMap.entries()) {
      if (v.timestamps.length === 0 || now - v.timestamps[v.timestamps.length - 1] > windowMs) {
        rateLimitMap.delete(k);
      }
    }
  }

  return {
    allowed: true,
    remaining: maxRequests - record.timestamps.length,
    resetInSeconds: Math.ceil(windowMs / 1000),
  };
}

/**
 * Constant-time string equality check to prevent timing attacks
 */
export function safeCompare(a, b) {
  if (typeof a !== "string" || typeof b !== "string") return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) {
    // Prevent timing leak on length by comparing a dummy buffer
    crypto.timingSafeEqual(bufA, bufA);
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Validates MongoDB 24-character hex ObjectId
 */
export function isValidObjectId(id) {
  if (!id || typeof id !== "string") return false;
  return /^[0-9a-fA-F]{24}$/.test(id);
}

/**
 * Secure password hashing with PBKDF2 (100,000 iterations)
 */
export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    PBKDF2_ITERATIONS,
    PBKDF2_KEYLEN,
    PBKDF2_DIGEST
  ).toString("hex");
  return { hash, salt, iterations: PBKDF2_ITERATIONS };
}

/**
 * Verifies password using constant-time comparison.
 * Handles both new 100k iteration hashes and legacy 1k hashes smoothly.
 */
export function verifyPassword(password, storedHash, salt, iterations = PBKDF2_ITERATIONS) {
  try {
    const computed = crypto.pbkdf2Sync(
      password,
      salt,
      iterations,
      PBKDF2_KEYLEN,
      PBKDF2_DIGEST
    ).toString("hex");

    if (safeCompare(computed, storedHash)) {
      return true;
    }

    // Fallback check for legacy 1000 iterations
    if (iterations !== 1000) {
      const legacy = crypto.pbkdf2Sync(
        password,
        salt,
        1000,
        PBKDF2_KEYLEN,
        PBKDF2_DIGEST
      ).toString("hex");
      return safeCompare(legacy, storedHash);
    }
  } catch {
    return false;
  }
  return false;
}

/**
 * Generates an HMAC-SHA256 signed JWT
 */
export function generateToken(payload) {
  const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60; // 30 days
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString("base64url");
  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");
  return `${header}.${body}.${signature}`;
}

/**
 * Verifies JWT using constant-time signature comparison
 */
export function verifyToken(token) {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [header, body, signature] = parts;

  const expectedSignature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(`${header}.${body}`)
    .digest("base64url");

  if (!safeCompare(signature, expectedSignature)) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString());
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies user from Authorization header
 */
export async function getUserFromRequest(request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  const token = authHeader.substring(7).trim();
  const decoded = verifyToken(token);
  if (!decoded || !decoded.userId || !isValidObjectId(decoded.userId)) return null;

  const db = await getDb();
  if (!db) {
    return { id: decoded.userId, username: decoded.username, email: decoded.email };
  }

  try {
    const user = await db.collection("users").findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { passwordHash: 0, salt: 0 } }
    );
    if (!user) return null;
    return {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    };
  } catch {
    return null;
  }
}
