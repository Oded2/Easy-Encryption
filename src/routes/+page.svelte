<script lang="ts">
  import Password from "$lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { encrypt, decrypt, addParams } from "$lib";
  import Switch from "$lib/components/Switch.svelte";

  const { data } = $props();
  const copyMessage = "Copied to Clipboard";

  const { isDecrypt, origin } = data;
  let { user, password } = $state(data);
  let isEncrypt = $state(!isDecrypt);
  const copyPress = $state({
    text: copyMessage,
    website: "Share the website",
    password: "Share the website with the current password",
    user: "Share the website with the current text",
    userPassword: "Share the website with the current password and text",
  });
  let pastePress = $state(false);
  let result = $derived(
    isEncrypt ? encrypt(user, password) : decrypt(user, password)
  );
  let shortUrl: boolean = $state(false);

  async function copy(
    text: string,
    change: keyof typeof copyPress,
    isShort: boolean = false
  ): Promise<void> {
    const apiUrl = "https://tinyurl.com/api-create.php";
    const original = copyPress[change];
    let toWrite: string = text;
    if (isShort) {
      copyPress[change] = "Awaiting URL...";
      const response = await fetch(addParams(apiUrl, { url: text }));
      toWrite = await response.text();
    }
    navigator.clipboard.writeText(toWrite);
    copyPress[change] = copyMessage;
    setTimeout(() => (copyPress[change] = original), 1500);
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
          spellcheck={isEncrypt}
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
          tip={copyPress.text}
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
</main>
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
          )}>Text</button
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
          )}>Password & Text</button
      >
    </div>
  </div>
</Modal>
<svelte:head><title>Easy Encryption</title></svelte:head>
