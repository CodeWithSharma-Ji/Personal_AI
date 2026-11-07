import { getDb } from "@/lib/mongodb";

export async function GET() {
  const db = await getDb();
  let dbStatus = "ok";

  if (db) {
    try {
      await db.command({ ping: 1 });
    } catch {
      dbStatus = "degraded";
    }
  }

  return Response.json({
    status: "ok",
    db: dbStatus,
  });
}
