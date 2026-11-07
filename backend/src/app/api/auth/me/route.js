import { getUserFromRequest } from "@/lib/auth";

export async function GET(request) {
  const user = await getUserFromRequest(request);
  if (!user) {
    return Response.json({ user: null }, { status: 401 });
  }

  return Response.json({ user });
}
