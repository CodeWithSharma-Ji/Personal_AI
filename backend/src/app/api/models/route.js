import { AVAILABLE_MODELS } from "@/lib/models";

export async function GET() {
  return Response.json({
    models: AVAILABLE_MODELS,
    defaultModel: "gpt-4o",
  });
}
