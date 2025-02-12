<script lang="ts">
  import Password from "$lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { encrypt, decrypt, addParams } from "$lib";
  import Switch from "$lib/components/Switch.svelte";
  import pkg from "lz-string";
  import { addToast } from "$lib/toasts.js";
  import Toasts from "$lib/components/Toasts.svelte";

  const { data } = $props();
  const { isDecrypt, origin } = data;
  const { compressToBase64, decompressFromBase64 } = pkg;
  let { user, password } = $state(data);
  let isEncrypt = $state(!isDecrypt);
  const copyPress = $state({
    text: "Copy to Clipboard",
    website: "Share the website",
    password: "Share the website with the current password",
    user: "Share the website with the current text",
    userPassword: "Share the website with the current password and text",
  });
  let pastePress = $state("Paste from Clipboard");
  let result = $derived(
    isEncrypt ? encrypt(user, password) : decrypt(user, password)
  );
  let shortUrl: boolean = $state(false);
  // "lastResult" is a variable that ensures that the user doesn't double-compress/decompress
  let lastResult: string = $state("");
  let userUncompressed = $state("");
  // When this variable is true, the user cannot compress/decompress the text/result
  let isCompressed = $derived(
    lastResult === result &&
      userUncompressed.length > 0 &&
      user !== userUncompressed
  );

  async function copy(
    text: string,
    change: keyof typeof copyPress,
    shorten: boolean = false
  ): Promise<void> {
    const original = copyPress[change];
    const copyMessage = "Copied to Clipboard";
    if (original === copyMessage) return;
    let toWrite: string = text;
    if (shorten) {
      copyPress[change] = "Awaiting URL...";
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
        },
        body: text,
      });
      toWrite = await response.text();
    }
    try {
      await navigator.clipboard.writeText(toWrite);
      copyPress[change] = copyMessage;
    } catch (e) {
      console.error(e);
      addToast({
        text: "Error Copying to Clipboard",
        duration: 5000,
        type: "error",
      });
    }
    setTimeout(() => (copyPress[change] = original), 1500);
  }
  async function paste(): Promise<void> {
    const original = pastePress;
    const pasteMessage = "Pasted from Clipboard";
    if (original === pasteMessage) return;
    try {
      const clip = await navigator.clipboard.readText();
      user = clip;
      pastePress = pasteMessage;
    } catch (error) {
      console.error(error);
      addToast({
        text: "Failed to Paste from Clipboard",
        duration: 5000,
        type: "error",
      });
    }
    setTimeout(() => (pastePress = original), 1500);
  }
  function showModal(): void {
    const modal = document.getElementById("modal") as HTMLDialogElement;
    modal.showModal();
  }
  function swap(toEncrypt: boolean): void {
    // Swaps between encrypt and decrypt, and resets the text
    isEncrypt = toEncrypt;
    user = "";
  }
  function swapStore(): void {
    // Swaps between encrypt and decrypt, but stores the current text
    user = result;
    isEncrypt = !isEncrypt;
  }
  function handleFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        user = reader.result as string;
      };
      reader.onerror = () => {
        console.error(reader.error);
      };
      reader.readAsText(file);
    }
    input.value = "";
  }
  function handleCompression(): void {
    if (user.length == 0) {
      addToast({
        text: "Nothing to compress/decompress",
        duration: 5000,
        type: "info",
      });
      return;
    }
    userUncompressed = user;
    if (isEncrypt) {
      const compressed = compressToBase64(user);
      if (compressed.length >= user.length) {
        addToast({
          text: "Compressed text has more characters than the original text. Your input has not been modified.",
          duration: 5000,
          type: "info",
        });
        return;
      }
      user = compressed;
    } else {
      swapStore();
      user = decompressFromBase64(user);
      swapStore();
    }
    lastResult = result;
  }
  function undoCompression(): void {
    user = userUncompressed;
  }
</script>

<main class="font-quicksand">
  <div class="container mx-auto px-2 sm:px-0 mb-10 mt-2 md:mt-1">
    <div class="navbar bg-base-100 mb-5 md:mb-2 lg:mb-10 print:hidden">
      <div class="navbar-start"></div>
      <div class="navbar-center">
        <button
          onclick={() => swap(true)}
          class:btn-active={isEncrypt}
          class="btn btn-ghost text-xl mx-2">Encrypt</button
        >
        <button
          onclick={() => swap(false)}
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
          onclick={paste}
          onchange={handleFile}
          spellcheck={isEncrypt}
          placeholder={"Enter text here"}
          bind:val={user}
          tip={pastePress}
        ></Textbox>
        <div class="border-b-2 mb-5"></div>
        <div class="flex gap-2">
          <div class="w-full sm:w-auto">
            <Password bind:password></Password>
          </div>
          <button
            onclick={swapStore}
            aria-label="Swap"
            class="btn btn-neutral btn-outline print:hidden"
            ><i class="fa-solid fa-right-left"></i></button
          >
        </div>
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
          placeholder={user.length > 0
            ? "Invalid text/password"
            : "No text to decrypt"}
          val={result}
          tip={copyPress.text}
          onclick={() => copy(result, "text")}
        ></Textbox>
        <div class="mt-2 mx-2 flex flex-col print:hidden">
          <span
            >{isEncrypt ? "Too long?" : "Doesn't look right?"}
            <button
              class:link={!isCompressed}
              class:opacity-60={isCompressed}
              class:btn-disabled={isCompressed}
              onclick={handleCompression}
              >{isEncrypt ? "Compress" : "Decompress"}
            </button>
          </span>
          {#if isCompressed}
            <span>
              Change your mind?
              <button class="link" onclick={undoCompression}>Undo</button>
            </span>
          {/if}
        </div>
      </div>
    </div>
    <div class="mt-10 w-full md:hidden flex justify-center print:hidden">
      <button
        aria-label="Share"
        onclick={showModal}
        class="btn btn-primary btn-circle w-1/2"
        ><i class="fa-solid fa-share"></i>
        <h6 class="font-bold text-base">Share</h6></button
      >
    </div>
  </div>
</main>

<button
  aria-label="Share"
  onclick={showModal}
  class=" btn btn-circle btn-primary hidden md:block fixed right-5 bottom-5"
>
  <i class="fa-solid fa-share text-lg"></i>
</button>
<Modal id="modal">
  <div class="border-b-2 mb-4 pb-2 text-center">
    <h3 class="text-xl font-bold">Share</h3>
    <h5 class="text-base font-medium">Select which link to copy</h5>
    <Switch
      bind:state={shortUrl}
      text="Short URL"
      disclaimer="Shortened link is dependent on TinyURL"
    ></Switch>
  </div>
  <div class="grid gap-y-4">
    <div class="tooltip w-full sm:w-3/4 mx-auto" data-tip={copyPress.website}>
      <button
        class="btn btn-neutral btn-outline w-full"
        onclick={() => copy(origin, "website")}
        >Website
      </button>
    </div>
    <div class="tooltip w-full sm:w-3/4 mx-auto" data-tip={copyPress.password}>
      <button
        class="btn btn-neutral btn-outline w-full"
        onclick={() =>
          copy(addParams(origin, { password }), "password", shortUrl)}
        >Password
      </button>
    </div>

    <div class="tooltip w-full sm:w-3/4 mx-auto" data-tip={copyPress.user}>
      <button
        class="btn btn-neutral btn-outline w-full"
        onclick={() =>
          copy(
            addParams(origin, {
              text: isEncrypt ? result : user,
              page: "decrypt",
            }),
            "user",
            shortUrl
          )}>Encrypted Text</button
      >
    </div>
    <div
      class="tooltip w-full sm:w-3/4 mx-auto"
      data-tip={copyPress.userPassword}
    >
      <button
        class="btn btn-neutral btn-outline w-full"
        onclick={() =>
          copy(
            addParams(origin, {
              text: isEncrypt ? result : user,
              password,
              page: "decrypt",
            }),
            "userPassword",
            shortUrl
          )}>Encrypted Text &amp; Password</button
      >
    </div>
  </div>
</Modal>
<Toasts></Toasts>
<svelte:head><title>Easy Encryption</title></svelte:head>
