export async function GET() {
  const apiKey = process.env.AI_API_KEY;
  const customApiUrl = process.env.AI_API_URL &&
    process.env.AI_API_URL !== "https://api.openai.com/v1/chat/completions";

  return Response.json({
    status: "ok",
    assistantConfigured: Boolean(
      (apiKey && apiKey !== "replace-with-your-provider-key") || customApiUrl,
    ),
  });
}