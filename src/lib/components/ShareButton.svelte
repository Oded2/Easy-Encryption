<script lang="ts">
  import { closeModal, showModal } from "$lib";
  import { addToast } from "$lib/toasts";
  import { toDataURL } from "qrcode";

  const {
    title,
    link,
    shorten,
  }: {
    title: string;
    link: string;
    shorten: boolean;
  } = $props();

  const disabledMessage = "URL is too long";
  const clipboardTip = "Copy to Clipboard";
  const timeoutDuration = 1500;
  const copyMessage = "Copied!";
  const disabled: boolean = $derived(link.length > 10000);
  let reactiveTip: string = $state(clipboardTip);
  let inProgress: boolean = $state(false);
  let timeout: NodeJS.Timeout | undefined;

  async function copy(): Promise<void> {
    const original = reactiveTip;
    // If already showing copyMessage, clear and reset the timeout
    if (original === copyMessage) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => (reactiveTip = clipboardTip), timeoutDuration);
      return;
    }
    let toWrite: string = link;
    if (shorten) {
      reactiveTip = "Awaiting URL...";
      toWrite = await shortenURL();
    }
    try {
      await navigator.clipboard.writeText(toWrite);
      if (timeout) clearTimeout(timeout);
      reactiveTip = copyMessage;
    } catch (e) {
      console.error(e);
      addToast({
        text: "Error Copying to Clipboard",
        duration: 5000,
        type: "error",
      });
    }
    timeout = setTimeout(() => (reactiveTip = clipboardTip), timeoutDuration);
  }

  async function qr(): Promise<void> {
    const qrTitle = document.getElementById("qrTitle") as HTMLHeadingElement;
    const image = document.getElementById("qrImage") as HTMLImageElement;
    const download = document.getElementById("qrDownload") as HTMLAnchorElement;
    let qrLink: string = link;
    inProgress = true;
    if (link.length > 1000) qrLink = await shortenURL();
    try {
      const url = await toDataURL(qrLink, { width: 400 });
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
    closeModal("share");
    showModal("qr");
    qrTitle.textContent = qrLink;
  }

  async function shortenURL(): Promise<string> {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: link,
    });
    if (!response.ok) return link;
    return await response.text();
  }
</script>

<div class="w-full sm:w-3/4 mx-auto join" data-tip={reactiveTip}>
  <div
    class="tooltip w-full"
    data-tip={disabled ? disabledMessage : reactiveTip}
  >
    <button
      class="btn btn-neutral join-item w-full"
      class:btn-outline={!disabled}
      onclick={copy}
      {disabled}
    >
      {title}
    </button>
  </div>
  <div class="tooltip" data-tip={disabled ? disabledMessage : "Create QR Code"}>
    <button
      class="btn btn-neutral btn-square join-item"
      class:skeleton={inProgress}
      disabled={disabled || inProgress}
      aria-label="Create QR Code"
      onclick={qr}
    >
      <i class="fa-solid fa-qrcode"></i>
    </button>
  </div>
</div>
