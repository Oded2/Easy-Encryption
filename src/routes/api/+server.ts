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
  const result: string =
    action === "encrypt" ? encrypt(text, password) : decrypt(text, password);
  if (result.length == 0) error(401, { message: "Invalid password" });
  const data: { result: string } = {
    result,
  };
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
};
