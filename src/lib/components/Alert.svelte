<script lang="ts">
  import { fly } from "svelte/transition";

  const {
    id,
    text,
    duration = 5000,
    type,
  }: {
    id: string;
    text: string;
    duration?: number;
    type: "info" | "error";
  } = $props();

  let visible = $state(false);
  let progress: number = $state(100);
  let interval: number;
  let timeout: number;

  function showAlert(): void {
    if (duration == 0) {
      visible = true;
      return;
    }
    const start = Date.now();
    if (visible) resetInterval();
    else visible = true;
    interval = setInterval(() => {
      const elapsed = Date.now() - start;
      progress = Math.max(100 - (elapsed * 100) / duration, 0);
    }, 10);
    timeout = setTimeout(() => {
      visible = false;
      clearInterval(interval);
    }, duration);
  }

  function handleClose(): void {
    resetInterval();
    visible = false;
  }

  function resetInterval(): void {
    clearTimeout(timeout);
    clearInterval(interval);
  }
</script>

<button class="hidden" aria-label="Alert" {id} onclick={showAlert}></button>

{#if visible}
  <div
    role="alert"
    class="alert max-w-md flex flex-col fixed left-2 bottom-2 items-stretch"
    class:alert-info={type === "info"}
    class:alert-error={type === "error"}
    transition:fly={{ duration: 200, y: 200 }}
  >
    <div class="flex gap-2 items-baseline">
      {#if type === "info"}
        <i class="fa-solid fa-info-circle"></i>
      {:else if type === "error"}
        <i class="fa-solid fa-exclamation-circle"></i>
      {/if}
      <span>{text}</span>
      <button
        class="btn btn-ghost btn-sm btn-circle ms-auto"
        aria-label="Close"
        onclick={handleClose}
      >
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    {#if duration > 0}
      <progress value={progress} max="100" class="progress"></progress>
    {/if}
  </div>
{/if}
