<script lang="ts">
  import { closeModal, showModal } from "$lib";
  import { addToast } from "$lib/toasts";
  import { toDataURL } from "qrcode";
  import CopyButton from "./CopyButton.svelte";
  import type { MouseEventHandler } from "svelte/elements";

  const {
    title,
    link,
    shorten,
  }: {
    title: string;
    link: string;
    shorten: boolean;
  } = $props();

  const disabled: boolean = $derived(link.length > 10000);
  let inProgress: boolean = $state(false);

  const qr: MouseEventHandler<HTMLButtonElement> = async () => {
    const qrTitle = document.getElementById("qrTitle") as HTMLHeadingElement;
    const image = document.getElementById("qrImage") as HTMLImageElement;
    const download = document.getElementById("qrDownload") as HTMLAnchorElement;
    let qrLink: string = link;
    inProgress = true;
    if (link.length > 2000) qrLink = await shortenURL(link);
    try {
      const url = await toDataURL(qrLink, { width: 800 });
      download.href = url;
      image.src = url;
    } catch (e) {
      console.error(e);
      addToast({
        type: "error",
        text: "Error creating QR code",
        duration: 5000,
      });
      return;
    } finally {
      inProgress = false;
    }
    qrTitle.textContent = qrLink;
    closeModal("share");
    showModal("qr");
  };

  async function shortenURL(url: string): Promise<string> {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: url,
    });
    if (!response.ok) {
      addToast({ type: "error", text: response.statusText, duration: 5000 });
      return link;
    }
    return await response.text();
  }
</script>

<div class="w-full sm:w-3/4 mx-auto join">
  <CopyButton
    text={link}
    className="btn btn-neutral join-item w-full btn-outline"
    modifier={{
      func: shortenURL,
      text: "Awaiting URL...",
      activate: shorten,
    }}
  >
    {title}
  </CopyButton>
  <div
    class="tooltip"
    data-tip={disabled ? "URL is too long" : "Create QR Code"}
  >
    <button
      class="btn btn-neutral btn-square join-item"
      class:skeleton={inProgress}
      class:rounded-s-none={inProgress}
      disabled={disabled || inProgress}
      aria-label="Create QR Code"
      onclick={qr}
    >
      <i class="fa-solid fa-qrcode"></i>
    </button>
  </div>
</div>
