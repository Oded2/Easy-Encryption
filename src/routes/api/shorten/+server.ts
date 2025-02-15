import { addParams } from "$lib";
import { error } from "@sveltejs/kit";
import { TINYURL_API_KEY } from "$env/static/private";

export async function POST({ request, url }) {
  if (request.headers.get("origin") !== url.origin)
    throw error(401, { message: "Unauthorized" });
  const endpoint = "https://api.tinyurl.com/create";
  const text = await request.text();
  if (text.length > 10000)
    throw error(413, {
      message: "URL length must be under 10,000 characters long",
    });
  const payload = { url: text };
  const response = await fetch(
    addParams(endpoint, { api_token: TINYURL_API_KEY }),
    {
      method: "POST",
      headers: {
        accept: "application.json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
  if (!response.ok)
    throw error(response.status, { message: response.statusText });
  const data = await response.json();
  const shortUrl = data["data"]["tiny_url"] as string | null;
  if (!shortUrl) throw error(400, { message: "Bad request" });
  return new Response(shortUrl, {
    headers: { "Content-Type": "text/plain" },
  });
}
