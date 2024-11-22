<script lang="ts">
  import Password from "./../lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  import * as crypto from "crypto-ts";
  let isEncrypt = true;
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
  async function paste(): Promise<string> {
    try {
      const clip = await navigator.clipboard.readText();
      return clip;
    } catch (error) {
      console.error(error);
    }
    return "";
  }
</script>

<div class="container mx-auto px-2 sm:px-0 my-10 font-quicksand">
  <button
    on:click={() => {
      isEncrypt = !isEncrypt;
      user = "";
    }}
    class="font-semibold text-lg underline">Switch</button
  >
  <div class="md:grid grid-cols-2 lg:h-96">
    <div class="col-auto">
      <h1 class="font-bold text-5xl">
        {#if isEncrypt}
          Enter Text to Encrypt
        {:else}
          Enter Encrypted Text
        {/if}
      </h1>

      <Textbox placeholder={"Place Text Here"} bind:val={user}></Textbox>
      <div class="border-b-2 mb-5"></div>
      <Password bind:password></Password>
      <button
        class="btn btn-neutral mt-2 w-full max-w-xs"
        on:click={async () => {
          const clip = await paste();
          user = clip;
        }}>Paste</button
      >
    </div>
    <div class="col-auto">
      <h1 class="font-bold text-5xl">
        {#if isEncrypt}
          Encrypted Text
        {:else}
          Decrypted Text
        {/if}
      </h1>
      <Textbox
        val={isEncrypt ? encrypt(user, password) : decrypt(user, password)}
        disabled
      ></Textbox>
      {#if isEncrypt}
        <div class="w-full p-10">
          <button
            on:click={() => navigator.clipboard.writeText(encrypted)}
            class="btn btn-neutral w-full max-w-xs">Copy</button
          >
        </div>
      {/if}
    </div>
  </div>
</div>
