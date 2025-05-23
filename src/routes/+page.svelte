<script lang="ts">
  import Password from "$lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { encrypt, decrypt, addParams, showModal, closeModal } from "$lib";
  import Switch from "$lib/components/Switch.svelte";
  import pkg from "lz-string";
  import { addToast } from "$lib/toasts.js";
  import Toasts from "$lib/components/Toasts.svelte";
  import About from "$lib/components/About.svelte";
  import ShareButton from "$lib/components/ShareButton.svelte";
  import InputLabel from "$lib/components/InputLabel.svelte";
  import type { MouseEventHandler } from "svelte/elements";

  const { data } = $props();
  const { isDecrypt, origin } = data;
  const { compressToBase64, decompressFromBase64 } = pkg;

  let { user, password } = $state(data);
  let isEncrypt = $state(!isDecrypt);
  const result: string = $derived(
    isEncrypt ? encrypt(user, password) : decrypt(user, password)
  );
  const passwordLink: string = $derived(addParams(origin, { password }));
  const textLink = $derived(
    addParams(origin, {
      text: isEncrypt ? result : user,
      page: "decrypt",
    })
  );
  const textPasswordLink = $derived(
    addParams(origin, {
      text: isEncrypt ? result : user,
      password,
      page: "decrypt",
    })
  );
  let shortUrl: boolean = $state(false);
  // "lastResult" is a variable that ensures that the user doesn't double-compress/decompress
  let lastResult: string = $state("");
  let userUncompressed = $state("");
  // When this variable is true, the user cannot compress/decompress the text/result
  const isCompressed: boolean = $derived(
    lastResult === result &&
      userUncompressed.length > 0 &&
      user !== userUncompressed
  );
  let filename: string = $state("");
  const illegalFilename: boolean = $derived(
    /[<>:"\/\\|?*\x00-\x1F]/.test(filename)
  );
  let isTrim: boolean = $state(true);
  let passwordConfirm: string = $state("");

  const downloadText: MouseEventHandler<HTMLButtonElement> = () => {
    if (illegalFilename) return;
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename.length > 0 ? filename + ".txt" : "Text.txt";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const handleTrimChange: MouseEventHandler<HTMLButtonElement> = () => {
    if (isTrim) {
      isTrim = false;
    } else {
      user = user.trim();
      isTrim = true;
    }
  };

  const handleQrToShare: MouseEventHandler<HTMLButtonElement> = () => {
    closeModal("qr");
    showModal("share");
  };

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

<main id="main">
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
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div class="flex flex-col">
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
          spellcheck={isEncrypt}
          placeholder={"Enter text here"}
          {isTrim}
          bind:val={user}
        ></Textbox>
        <div class="border-b-2 mb-5"></div>
        <div class="flex gap-2">
          <div class="w-full sm:w-auto">
            <Password placeholder="Enter password" bind:password></Password>
          </div>
          <button
            onclick={() => swapStore()}
            aria-label="Swap"
            class="btn btn-neutral btn-outline print:hidden"
            ><i class="fa-solid fa-right-left"></i></button
          >
        </div>
      </div>
      <div class="flex flex-col">
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
          ondownload={() => (filename = "")}
        ></Textbox>
        <div class="flex p-2">
          <button class="btn" onclick={() => showModal("options")}
            >Show Options</button
          >
        </div>
      </div>
    </div>
    <div class="mt-10 w-full lg:hidden flex justify-center print:hidden">
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
  class="btn btn-circle btn-primary hidden lg:block fixed right-5 bottom-5"
>
  <i class="fa-solid fa-share text-lg"></i>
</button>

<Modal id="qr">
  <div class="border-b-2 mb-4 pb-2 text-center">
    <h3 id="qrTitle" class="text-xl font-bold truncate">Link not defined</h3>
  </div>
  <img src="/1x1.png" alt="Qr Code" id="qrImage" class="mx-auto" />
  <div
    class="border-t-2 mt-4 pt-2 flex flex-col justify-baseline items-center gap-2 print:hidden"
  >
    <a
      href="/1x1.png"
      download="qrcode.png"
      class="btn btn-neutral w-full max-w-xs text-base"
      id="qrDownload"
    >
      <i class="fa-solid fa-cloud-arrow-down"></i> Download</a
    >
    <button
      onclick={handleQrToShare}
      class="btn btn-neutral btn-outline w-full max-w-xs text-base"
    >
      <i class="fa-solid fa-rotate-left"></i> Back
    </button>
  </div>
</Modal>
<Modal id="download">
  <div class="flex gap-2">
    <InputLabel>
      <input
        type="text"
        class="grow"
        placeholder="Enter File Name (optional)"
        bind:value={filename}
      />
      {#if illegalFilename}
        <span class="badge badge-error badge-xs cursor-auto">
          Invalid Filename
        </span>
      {/if}
    </InputLabel>
    <button
      onclick={downloadText}
      disabled={illegalFilename}
      class="btn btn-neutral flex-1"
    >
      <i class="fa-solid fa-cloud-arrow-down"></i> Download
    </button>
  </div>
</Modal>
<Modal id="share">
  <div class="border-b-2 mb-4 pb-2 text-center flex flex-col gap-1">
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
<Modal id="options">
  <div class="flex flex-col gap-2 max-w-xs mx-auto">
    <h2 class="font-bold text-xl text-center">Options</h2>
    <button class="btn btn-neutral btn-outline" onclick={handleTrimChange}
      >{isTrim ? "Disable Text Trim" : "Enable Text Trim"}</button
    >
    <button
      class="btn btn-neutral btn-outline"
      onclick={() => {
        if (isCompressed) undoCompression();
        else handleCompression();
      }}
    >
      {isCompressed
        ? `Undo ${isEncrypt ? "Compression" : "Decompression"}`
        : `${isEncrypt ? "Compress" : "Decompress"} Text`}
    </button>
    <Password
      placeholder="Confirm password (optional)"
      bind:password={passwordConfirm}
    >
      <div
        class="tooltip"
        data-tip={password === passwordConfirm
          ? "Passwords match"
          : "Passwords do not match"}
      >
        {#if password === passwordConfirm}
          <i class="fa-solid fa-circle-check text-success"></i>
        {:else}
          <i class="fa-solid fa-circle-xmark"></i>
        {/if}
      </div>
    </Password>
  </div>
</Modal>
<Toasts></Toasts>

<svelte:head><title>Easy Encryption</title></svelte:head>
