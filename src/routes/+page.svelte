<script lang="ts">
  import Password from "./../lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  import * as crypto from "crypto-ts";
  let isEncrypt = true;
  let user: string = "";
  let password: string = "";

  $: result = isEncrypt ? encrypt(user, password) : decrypt(user, password);

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

<div class="navbar bg-base-100 justify-center">
  <button
    on:click={() => {
      isEncrypt = true;
      user = "";
    }}
    class:btn-active={isEncrypt}
    class="btn btn-ghost text-xl font-quicksand mx-2">Encrypt</button
  >
  <button
    on:click={() => {
      isEncrypt = false;
      user = "";
    }}
    class:btn-active={!isEncrypt}
    class="btn btn-ghost text-xl font-quicksand mx-2">Decrypt</button
  >
</div>

<div class="container mx-auto px-2 sm:px-0 my-10 font-quicksand">
  <div class="md:grid grid-cols-2 gap-4">
    <div class="col-auto flex flex-col">
      <h1 class="font-bold text-5xl mb-3">
        {#if isEncrypt}
          Enter Text to Encrypt
        {:else}
          Enter Encrypted Text
        {/if}
      </h1>
      <Textbox
        on:click={async () => (user = await paste())}
        placeholder={"Place Text Here"}
        bind:val={user}
        tip="Paste from Clipboard"
      ></Textbox>
      <div class="border-b-2 mb-5"></div>
      <Password bind:password></Password>
    </div>

    <div class="col-auto flex flex-col mt-5 md:mt-0">
      <h1 class="font-bold text-5xl mb-3">
        {#if isEncrypt}
          Encrypted Text
        {:else}
          Decrypted Text
        {/if}
      </h1>
      <Textbox
        disabled
        placeholder={user.length > 0 ? "Invalid Text/Password" : ""}
        val={result}
        tip="Copy to Clipboard"
        on:click={() => navigator.clipboard.writeText(result)}
      ></Textbox>
    </div>
  </div>
</div>

<svelte:head><title>Easy Encryption</title></svelte:head>
