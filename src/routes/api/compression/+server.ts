import { decode } from "@kunigi/string-compression";
import { encode } from "@kunigi/string-compression";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  const text = data["text"] as string;
  const action = data["action"] as "compress" | "decompress";
  const result = action === "compress" ? encode(text) : decode(text);
  return new Response(result, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
