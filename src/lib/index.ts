import { enc, AES } from "crypto-ts";

export function encrypt(text: string, password: string): string {
  return AES.encrypt(text, password).toString();
}
export function decrypt(text: string, password: string): string {
  let decrypted: string = "";
  try {
    decrypted = AES.decrypt(text, password).toString(enc.Utf8);
  } catch (error) {
    console.debug(error);
  } finally {
    return decrypted;
  }
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

export function showModal(id: string): void {
  const modal = document.getElementById(id) as HTMLDialogElement;
  const collapse = document.getElementById("collapse") as HTMLDivElement;
  const printHidden: boolean = !collapse.classList.contains("print:hidden");
  if (printHidden) {
    collapse.classList.add("print:hidden");
    modal.addEventListener(
      "close",
      () => collapse.classList.remove("print:hidden"),
      { once: true }
    );
  }
  modal.showModal();
}
export function closeModal(id: string): void {
  const modal = document.getElementById(id) as HTMLDialogElement;
  const event = new Event("close");
  modal.dispatchEvent(event);
  modal.close();
}
