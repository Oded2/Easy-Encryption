import { decrypt, encrypt } from "$lib";
import { error, type RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async ({ url }) => {
  const action = url.searchParams.get("action");
  const text = url.searchParams.get("text");
  const password = url.searchParams.get("password") ?? "";
  if (!action) error(400, { message: "Action is required" });
  if (!text) error(400, { message: "Text is required" });
  if (!(action === "encrypt" || action === "decrypt"))
    error(400, { message: "Invalid action" });
  const data: { result: string } = {
    result:
      action === "encrypt" ? encrypt(text, password) : decrypt(text, password),
  };
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
