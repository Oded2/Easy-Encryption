import * as crypto from "crypto-ts";

export function encrypt(text: string, password: string): string {
  return crypto.AES.encrypt(text, password).toString();
}
export function decrypt(encryptedText: string, password: string): string {
  try {
    return crypto.AES.decrypt(encryptedText, password).toString(
      crypto.enc.Utf8
    );
  } catch (error) {
    console.debug(error);
  }
  return "";
}
