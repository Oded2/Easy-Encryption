<script lang="ts">
  import { addToast } from "$lib/toasts";
  import type { Snippet } from "svelte";

  const {
    text,
    className,
    modifier,
    children,
  }: {
    text: string;
    className: string;
    modifier?: {
      func: (str: string) => Promise<string>;
      text: string;
      activate: boolean;
    };
    children: Snippet;
  } = $props();

  const originalMessage = "Copy to Clipboard";
  const copyConfirmation = "Copied!";
  const timeoutDuration = 1500;

  let reactiveTip: string = $state(originalMessage);
  let timeout: NodeJS.Timeout | null = null;

  async function copy(): Promise<void> {
    const original = reactiveTip;
    // If already showing copyMessage, clear and reset the timeout
    if (original === copyConfirmation) {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(
        () => (reactiveTip = originalMessage),
        timeoutDuration
      );
      return;
    }
    let toWrite: string = text;
    if (modifier && modifier.activate) {
      reactiveTip = modifier.text;
      toWrite = await modifier.func(text);
    }
    try {
      await navigator.clipboard.writeText(toWrite);
      if (timeout) clearTimeout(timeout);
      reactiveTip = copyConfirmation;
    } catch (e) {
      console.error(e);
      addToast({
        text: "Error Copying to Clipboard",
        duration: 5000,
        type: "error",
      });
    }
    timeout = setTimeout(
      () => (reactiveTip = originalMessage),
      timeoutDuration
    );
  }
</script>

<div class="tooltip w-full" data-tip={reactiveTip}>
  <button class={className} onclick={copy} aria-label="Copy to Clipboard">
    {@render children()}
  </button>
</div>
