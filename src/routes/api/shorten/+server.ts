import { addParams } from "$lib";
import { error } from "@sveltejs/kit";

export async function POST({ request }) {
  const apiUrl = "https://tinyurl.com/api-create.php";
  const text = await request.text();
  const response = await fetch(addParams(apiUrl, { url: text }));
  if (!response.ok) error(response.status, { message: response.statusText });
  const shortUrl = await response.text();
  return new Response(shortUrl, {
    headers: { "Content-Type": "text/plain" },
  });
}
