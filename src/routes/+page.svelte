<script lang="ts">
  import Password from "$lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { encrypt, decrypt, addParams, showModal } from "$lib";
  import Switch from "$lib/components/Switch.svelte";
  import pkg from "lz-string";
  import { addToast } from "$lib/toasts.js";
  import Toasts from "$lib/components/Toasts.svelte";
  import About from "$lib/components/About.svelte";
  import ShareButton from "$lib/components/ShareButton.svelte";

  const { data } = $props();
  const { isDecrypt, origin } = data;
  const { compressToBase64, decompressFromBase64 } = pkg;

  let { user, password } = $state(data);
  let isEncrypt = $state(!isDecrypt);
  const result = $derived(
    isEncrypt ? encrypt(user, password) : decrypt(user, password)
  );
  const passwordLink = $derived(addParams(origin, { password }));
  const textLink = $derived(
    addParams(origin, {
      text: isEncrypt ? result : user,
      page: "decrypt",
    })
  );
  const textPasswordLink = $derived(addParams(textLink, { password }));
  let pastePress = $state("Paste from Clipboard");
  let shortUrl: boolean = $state(false);
  // "lastResult" is a variable that ensures that the user doesn't double-compress/decompress
  let lastResult: string = $state("");
  let userUncompressed = $state("");
  // When this variable is true, the user cannot compress/decompress the text/result
  const isCompressed = $derived(
    lastResult === result &&
      userUncompressed.length > 0 &&
      user !== userUncompressed
  );

  async function copy(text: string): Promise<void> {
    try {
      await navigator.clipboard.writeText(text);
      addToast({
        duration: 5000,
        type: "success",
        text: "Text successfully copied to clipboard",
      });
    } catch (e) {
      console.error(e);
      addToast({
        text: "Error Copying to Clipboard",
        duration: 5000,
        type: "error",
      });
    }
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

<main class="font-quicksand" id="main">
  <div class="container mx-auto px-2 sm:px-0 mb-10 mt-2 md:mt-1">
    <nav class="navbar bg-base-100 mb-5 md:mb-2 lg:mb-10 print:hidden">
      <div class="navbar-start"></div>
      <div class="navbar-center gap-2">
        <button
          onclick={() => swap(true)}
          class:btn-active={isEncrypt}
          class="btn btn-ghost text-xl">Encrypt</button
        >
        <button
          onclick={() => swap(false)}
          class:btn-active={!isEncrypt}
          class="btn btn-ghost text-xl">Decrypt</button
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
    </nav>
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
          tip="Copy to Clipboard"
          onclick={() => copy(result)}
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
        onclick={() => showModal("share")}
        class="btn btn-primary btn-circle w-1/2"
        ><i class="fa-solid fa-share"></i>
        <h6 class="font-bold text-base">Share</h6></button
      >
    </div>
    <About></About>
  </div>
</main>

<button
  aria-label="Share"
  onclick={() => showModal("share")}
  class=" btn btn-circle btn-primary hidden md:block fixed right-5 bottom-5"
>
  <i class="fa-solid fa-share text-lg"></i>
</button>
<Modal id="qr">
  <div class="border-b-2 mb-4 pb-2 text-center">
    <h3 id="qrTitle" class="text-xl font-bold truncate">Link not defined</h3>
  </div>
  <canvas id="qrCanvas" class="mx-auto max-w-full"></canvas>
</Modal>
<Modal id="share">
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
    <ShareButton title="Website" link={origin} shorten={false}></ShareButton>
    <ShareButton title="Password" link={passwordLink} shorten={shortUrl}
    ></ShareButton>
    <ShareButton title="Encrypted Text" link={textLink} shorten={shortUrl}
    ></ShareButton>
    <ShareButton
      title="Encrypted Text & Password"
      link={textPasswordLink}
      shorten={shortUrl}
    ></ShareButton>
  </div>
</Modal>
<Toasts></Toasts>
<svelte:head><title>Easy Encryption</title></svelte:head>
