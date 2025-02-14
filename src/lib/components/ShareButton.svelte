<script lang="ts">
  import { addToast } from "$lib/toasts";

  const {
    tip,
    title,
    link,
    shorten,
  }: {
    tip: string;
    title: string;
    link: string;
    shorten: boolean;
  } = $props();

  let reactiveTip: string = $state(tip);

  async function copy(): Promise<void> {
    const copyMessage = "Copied to Clipboard";
    if (reactiveTip === copyMessage) return;
    let toWrite: string = link;
    if (shorten) {
      reactiveTip = "Await URL...";
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
    setTimeout(() => (reactiveTip = title), 1500);
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
</script>

<div class="tooltip w-full sm:w-3/4 mx-auto" data-tip={reactiveTip}>
  <button class="btn btn-neutral btn-outline w-full" onclick={copy}>
    {title}
  </button>
</div>
