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

  const clipboardTip = "Copy to Clipboard";
  let reactiveTip: string = $state(clipboardTip);
  let inProgress: boolean = $state(false);

  async function copy(): Promise<void> {
    const original = reactiveTip;
    const copyMessage = "Copied to Clipboard";
    if (original === copyMessage) return;
    let toWrite: string = link;
    if (shorten) {
      reactiveTip = "Awaiting URL...";
      toWrite = await shortenURL();
    }
    try {
      await navigator.clipboard.writeText(toWrite);
      reactiveTip = copyMessage;
    } catch (e) {
      console.error(e);
      addToast({
        text: "Error Copying to Clipboard",
        duration: 5000,
        type: "error",
      });
    }
    setTimeout(() => (reactiveTip = clipboardTip), 1500);
  }
  async function shortenURL(): Promise<string> {
    const response = await fetch("/api/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "text/plain",
      },
      body: link,
    });
    return await response.text();
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
      console.log(e);
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
</script>

<div class="w-full sm:w-3/4 mx-auto join" data-tip={reactiveTip}>
  <div class="tooltip w-full" data-tip={reactiveTip}>
    <button class="btn btn-neutral btn-outline join-item w-full" onclick={copy}>
      {title}
    </button>
  </div>
  <div class="tooltip" data-tip="Create QR Code">
    <button
      class="btn btn-neutral btn-square join-item"
      class:skeleton={inProgress}
      disabled={inProgress}
      aria-label="Create QR Code"
      onclick={qr}
    >
      <i class="fa-solid fa-qrcode"></i>
    </button>
  </div>
</div>
