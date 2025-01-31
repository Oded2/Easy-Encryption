<script lang="ts">
  import { fly } from "svelte/transition";

  const {
    id,
    text,
    duration = 5000,
  }: { id: string; text: string; duration?: number } = $props();

  let visible = $state(false);
  let progress: number = $state(100);
  let interval: number;
  let timeout: number;

  function showAlert(): void {
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
    class="alert alert-info max-w-md flex flex-col items-start fixed left-2 bottom-2"
    transition:fly={{ duration: 200, y: 200 }}
  >
    <div class="flex gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        class="h-6 w-6 shrink-0 stroke-current"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        ></path>
      </svg>
      <span>{text}</span>
    </div>
    <progress value={progress} max="100" class="progress"></progress>
    <button
      class="btn btn-ghost btn-sm btn-circle absolute top-2 right-2"
      aria-label="Close"
      onclick={handleClose}
    >
      <i class="fa-solid fa-xmark"></i>
    </button>
  </div>
{/if}
