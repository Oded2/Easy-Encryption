<script lang="ts">
  import Password from "./../lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  import * as crypto from "crypto-ts";
  let isEncrypt = false;
  let user: string = "";
  let password: string = "";

  $: encrypted = encrypt(user, password);

  function encrypt(text: string, password: string): string {
    const encrypted = crypto.AES.encrypt(text, password);
    return encrypted.toString();
  }
  function decrypt(encryptedText: string, password: string): string {
    const bytes = crypto.AES.decrypt(encryptedText, password);
    return bytes.toString(crypto.enc.Utf8);
  }
</script>

<div class="container mx-auto px-2 sm:px-0 my-10 font-quicksand">
  <div class="md:grid grid-cols-2 lg:h-96">
    <div class="col-auto">
      <h1 class="font-bold text-5xl">Enter Text to Encrypt</h1>
      <Textbox placeholder={"Place Text Here"} bind:val={user}></Textbox>
      <div class="border-b-2 mb-5"></div>
      <Password bind:password></Password>
    </div>
    <div class="col-auto">
      <h1 class="font-bold text-5xl">Encrypted Text</h1>
      <Textbox val={user.length > 0 ? encrypt(user, password) : ""} disabled
      ></Textbox>
      <div class="w-full p-5">
        <button
          on:click={() => navigator.clipboard.writeText(encrypted)}
          class="btn btn-neutral w-full max-w-xs">Copy</button
        >
      </div>
    </div>
  </div>
</div>
