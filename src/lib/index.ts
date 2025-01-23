import { enc, AES } from "crypto-ts/";

export function encrypt(text: string, password: string): string {
  return AES.encrypt(text, password).toString();
}
export function decrypt(text: string, password: string): string {
  try {
    return AES.decrypt(text, password).toString(enc.Utf8);
  } catch (error) {
    console.debug(error);
  }
  return "";
}
export function addParams(
  link: string,
  params: Record<string, string>,
  origin: string = ""
): string {
  // Adds URL parameters to a URL
  // If an origin is proved, then the url will be modified to include the origin
  const url: URL = new URL(origin.length > 0 ? origin + link : link);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });
  return url.toString();
}
