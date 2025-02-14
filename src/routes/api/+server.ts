import { decrypt, encrypt } from "$lib";
import { error } from "@sveltejs/kit";

export async function POST({ request }) {
  if (!request.body) throw error(400, { message: "Body cannot be empty" });
  const data = await request.json();
  const { action, text, password }: { [key: string]: string | undefined } =
    data;
  if (!action) throw error(400, { message: "Action is required" });
  if (!text) throw error(400, { message: "Text is required" });
  if (!(action === "encrypt" || action === "decrypt"))
    throw error(400, { message: "Invalid action" });
  const result: string =
    action === "encrypt"
      ? encrypt(text, password ?? "")
      : decrypt(text, password ?? "");
  if (result.length == 0) throw error(401, { message: "Invalid password" });
  const resultData: { result: string } = {
    result,
  };
  return new Response(JSON.stringify(resultData), {
    headers: { "Content-Type": "application/json" },
  });
}
