<script lang="ts">
  import * as crypto from "crypto-ts";
  import Password from "$lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  import Modal from "$lib/components/Modal.svelte";

  const { data } = $props();
  const copyMessage = "Copied to Clipboard";

  const { isDecrypt, origin } = data;
  let { user, password } = $state(data);
  let isEncrypt = $state(!isDecrypt);
  const copyPress = $state({
    text: false,
    website: false,
    password: false,
    user: false,
    userPassword: false,
  });
  let pastePress = $state(false);

  let result = $derived(
    isEncrypt ? encrypt(user, password) : decrypt(user, password)
  );
  function encrypt(text: string, password: string): string {
    return crypto.AES.encrypt(text, password).toString();
  }
  function decrypt(encryptedText: string, password: string): string {
    try {
      return crypto.AES.decrypt(encryptedText, password).toString(
        crypto.enc.Utf8
      );
    } catch (error) {
      console.error(error);
    }
    return "";
  }
  function copy(
    text: string,
    change: "text" | "website" | "password" | "user" | "userPassword"
  ): void {
    navigator.clipboard.writeText(text);
    copyPress[change] = true;
    setTimeout(() => (copyPress[change] = false), 1500);
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
    const url = new URL(origin);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
    return url.toString();
  }
  function swap(toEncrypt: boolean): void {
    isEncrypt = toEncrypt;
    user = "";
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
</script>

<main class="font-quicksand">
  <div class="container mx-auto px-2 sm:px-0 mb-10 mt-2 md:mt-1">
    <div class="navbar bg-base-100 mb-5 md:mb-2 lg:mb-10">
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
          onclick={async () => {
            user = await paste();
            pastePress = true;
            setTimeout(() => (pastePress = false), 1500);
          }}
          onchange={handleFile}
          placeholder={"Enter text here"}
          bind:val={user}
          tip={pastePress ? "Pasted from Clipboard" : "Paste from Clipboard"}
        ></Textbox>
        <div class="border-b-2 mb-5"></div>
        <div class="join">
          <div class="join-item w-full sm:w-auto">
            <Password bind:password></Password>
          </div>
          <div class="join-item px-2">
            <button
              onclick={() => {
                user = result;
                isEncrypt = !isEncrypt;
              }}
              aria-label="Swap"
              class="btn btn-neutral btn-outline"
              ><i class="fa-solid fa-right-left"></i></button
            >
          </div>
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
          placeholder={user.length > 0 ? "Invalid Text/Password" : ""}
          val={result}
          tip={copyPress.text ? copyMessage : "Copy to Clipboard"}
          onclick={() => copy(result, "text")}
        ></Textbox>
      </div>
    </div>
    <div class="mt-10 w-full md:hidden flex justify-center">
      <button
        aria-label="Share"
        onclick={showModal}
        class="btn btn-primary btn-circle w-1/2"
        ><i class="fa-solid fa-share"></i>
        <h6 class="font-bold text-base">Share</h6></button
      >
    </div>
  </div>

  <button
    aria-label="Share"
    onclick={showModal}
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
        class="tooltip w-full sm:w-3/4 mx-auto"
        data-tip={copyPress.website ? copyMessage : "Share the website"}
      >
        <button
          class="btn btn-neutral btn-outline w-full"
          onclick={() => copy(window.origin, "website")}
          >Website
        </button>
      </div>
      <div
        class="tooltip w-full sm:w-3/4 mx-auto"
        data-tip={copyPress.password
          ? copyMessage
          : "Share the website with the current password"}
      >
        <button
          class="btn btn-neutral btn-outline w-full"
          onclick={() => copy(addParams({ password }), "password")}
          >Password
        </button>
      </div>

      <div
        class="tooltip w-full sm:w-3/4 mx-auto"
        data-tip={copyPress.user
          ? copyMessage
          : "Share the website with the current text"}
      >
        <button
          class="btn btn-neutral btn-outline w-full"
          onclick={() =>
            copy(
              addParams({ text: isEncrypt ? result : user, decrypt: "true" }),
              "user"
            )}>Text</button
        >
      </div>
      <div
        class="tooltip w-full sm:w-3/4 mx-auto"
        data-tip={copyPress.userPassword
          ? copyMessage
          : "Share the website with the current password and text"}
      >
        <button
          class="btn btn-neutral btn-outline w-full"
          onclick={() =>
            copy(
              addParams({
                text: isEncrypt ? result : user,
                password,
                decrypt: "true",
              }),
              "userPassword"
            )}>Password & Text</button
        >
      </div>
    </div>
  </Modal>
</main>
<svelte:head><title>Easy Encryption</title></svelte:head>
