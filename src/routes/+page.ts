export function load({ url }) {
  const params = url.searchParams;
  const isDecrypt = params.get("decrypt") == "true";
  const user = params.get("text") ?? "";
  const password = params.get("password") ?? "";
  return { isDecrypt, user, password, origin: url.origin };
}
