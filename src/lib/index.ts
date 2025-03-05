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
  params: Record<string, string>
): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.append(key, value);
  });
  return `${link}?${searchParams.toString()}`;
}

export function showModal(id: string): void {
  const modal = document.getElementById(id) as HTMLDialogElement;
  const main = document.getElementById("main")!;
  main.classList.add("print:hidden");
  modal.addEventListener("close", () => main.classList.remove("print:hidden"), {
    once: true,
  });

  modal.showModal();
}

export function closeModal(id: string): void {
  const modal = document.getElementById(id) as HTMLDialogElement;
  const event = new Event("close");
  modal.dispatchEvent(event);
  modal.close();
}
