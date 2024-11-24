<script lang="ts">
  import Password from "./../lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  import * as crypto from "crypto-ts";
  import Modal from "$lib/components/Modal.svelte";

  export let data;

  const copyMessage = "Copied to Clipboard";

  let isEncrypt = !data.decrypt;
  let user: string = data.user;
  let password: string = data.password;
  let copyPress = false;
  let pastePress = false;

  $: result = isEncrypt ? encrypt(user, password) : decrypt(user, password);

  function encrypt(text: string, password: string): string {
    const encrypted = crypto.AES.encrypt(text, password);
    return encrypted.toString();
  }
  function decrypt(encryptedText: string, password: string): string {
    try {
      const bytes = crypto.AES.decrypt(encryptedText, password);
      return bytes.toString(crypto.enc.Utf8);
    } catch {
      console.error("Failed to decrypt message");
    }
    return "";
  }
  function copy(text: string, duration: number = 750): void {
    navigator.clipboard.writeText(text);
    copyPress = true;
    setTimeout(() => (copyPress = false), duration);
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
  function showModal(): void {
    const modal: any = document.getElementById("modal");
    modal.showModal();
  }
  function addParams(params: Record<string, string>): string {
    const url = new URL(window.origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }
</script>

<main class="font-quicksand">
  <div class="container mx-auto px-2 sm:px-0 mb-10 mt-2 md:mt-1">
    <div class="navbar bg-base-100 mb-5 md:mb-2 lg:mb-10">
      <div class="navbar-start"></div>
      <div class="navbar-center">
        <button
          on:click={() => {
            isEncrypt = true;
            user = "";
          }}
          class:btn-active={isEncrypt}
          class="btn btn-ghost text-xl mx-2">Encrypt</button
        >
        <button
          on:click={() => {
            isEncrypt = false;
            user = "";
          }}
          class:btn-active={!isEncrypt}
          class="btn btn-ghost text-xl mx-2">Decrypt</button
        >
      </div>
      <div class="navbar-end">
        <a
          aria-label="GitHub Respository"
          href="https://github.com/Oded2/Easy-Encryption"
          class="btn btn-neutral text-2xl"
          ><i class="fa-brands fa-github"></i></a
        >
      </div>
    </div>
    <div class="md:grid md:grid-cols-2 md:gap-4">
      <div class="col-auto flex flex-col">
        <h1
          class="font-bold text-3xl md:text-4xl lg:text-5xl mb-3 text-center md:text-start"
        >
          {#if isEncrypt}
            Enter Text to Encrypt
          {:else}
            Enter Encrypted Text
          {/if}
        </h1>
        <Textbox
          on:click={async () => {
            user = await paste();
            pastePress = true;
            setTimeout(() => (pastePress = false), 1500);
          }}
          placeholder={"Enter text here"}
          bind:val={user}
          tip={pastePress ? "Pasted from Clipboard" : "Paste from Clipboard"}
        ></Textbox>
        <div class="border-b-2 mb-5"></div>
        <Password bind:password></Password>
      </div>

      <div class="col-auto flex flex-col mt-5 md:mt-0">
        <h1
          class="font-bold text-3xl md:text-4xl lg:text-5xl mb-3 text-center md:text-start"
        >
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
          tip={copyPress ? copyMessage : "Copy to Clipboard"}
          on:click={() => copy(result, 1500)}
        ></Textbox>
      </div>
    </div>
    <div class="mt-10 w-full md:hidden flex justify-center">
      <button
        aria-label="Share"
        on:click={showModal}
        class="btn btn-primary btn-circle w-1/2"
        ><i class="fa-solid fa-share"></i>
        <h6 class="font-bold text-base">Share</h6></button
      >
    </div>
  </div>

  <button
    aria-label="Share"
    on:click={showModal}
    class=" btn btn-circle btn-primary hidden md:block absolute end-5 bottom-5"
  >
    <i class="fa-solid fa-share text-lg"></i>
  </button>

  <Modal id="modal">
    <div class="border-b-2 mb-4 pb-2 text-center">
      <h3 class="text-xl font-bold">Share</h3>
      <h5 class="text-base font-medium">Select which link to copy</h5>
    </div>
    <div class="grid gap-y-4">
      <div
        class="tooltip"
        data-tip={copyPress ? copyMessage : "Share the website"}
      >
        <button
          class="btn btn-neutral btn-outline w-full sm:w-3/4 mx-auto"
          on:click={() => copy(window.origin)}
          >Website
        </button>
      </div>
      <div
        class="tooltip"
        data-tip={copyPress
          ? copyMessage
          : "Share the website with the current password"}
      >
        <button
          class="btn btn-neutral btn-outline w-full sm:w-3/4 mx-auto"
          on:click={() => copy(addParams({ password }))}
          >Password
        </button>
      </div>
      {#if isEncrypt}
        <div
          class="tooltip"
          data-tip={copyPress
            ? copyMessage
            : "Share the website with the current text"}
        >
          <button
            class="btn btn-neutral btn-outline w-full sm:w-3/4 mx-auto"
            on:click={() => copy(addParams({ text: result, decrypt: "true" }))}
            >Text</button
          >
        </div>

        <div
          class="tooltip"
          data-tip={copyPress
            ? copyMessage
            : "Share the website with the current password and text"}
        >
          <button
            class="btn btn-neutral btn-outline w-full sm:w-3/4 mx-auto"
            on:click={() =>
              copy(
                addParams({
                  text: result,
                  password,
                  decrypt: "true",
                })
              )}>Password & Text</button
          >
        </div>
      {/if}
    </div>
  </Modal>
</main>
<svelte:head><title>Easy Encryption</title></svelte:head>
