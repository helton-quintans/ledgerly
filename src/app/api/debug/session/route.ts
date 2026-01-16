import { getServerSession } from "next-auth";
import authOptions from "../../../../lib/auth";

export async function GET(req: Request) {
  if (process.env.NODE_ENV === "production") {
    return new Response(JSON.stringify({ error: "Not allowed in production" }), { status: 403 });
  }

  const session = await getServerSession(authOptions as any);
  return new Response(JSON.stringify({ session }), {
    headers: { "Content-Type": "application/json" },
  });
}
