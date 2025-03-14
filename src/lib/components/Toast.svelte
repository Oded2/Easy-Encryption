<script lang="ts">
  import type { ToastType } from "$lib/toasts";
  import { type Snippet } from "svelte";
  import type { MouseEventHandler } from "svelte/elements";
  import { fly } from "svelte/transition";

  const {
    type,
    duration,
    handleClose,
    children,
  }: {
    type: ToastType;
    duration: number;
    handleClose: MouseEventHandler<HTMLButtonElement>;
    children: Snippet;
  } = $props();

  let progress = $state(100);
  showProgress();

  function showProgress(): void {
    if (duration <= 0) return;
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      progress = Math.max(100 - (elapsed * 100) / duration, 0);
    }, 10);
    setTimeout(() => {
      clearInterval(interval);
    }, duration);
  }
</script>

<div
  role="alert"
  class="alert flex flex-col items-stretch w-[28rem] max-w-[90vw] text-base"
  class:alert-success={type === "success"}
  class:alert-info={type === "info"}
  class:alert-error={type === "error"}
  transition:fly={{ duration: 200, y: 200 }}
>
  <div class="flex gap-2 items-baseline">
    {#if type === "success"}
      <i class="fa-solid fa-check-circle"></i>
    {:else if type === "info"}
      <i class="fa-solid fa-info-circle"></i>
    {:else if type === "error"}
      <i class="fa-solid fa-exclamation-circle"></i>
    {/if}
    <span>
      {@render children()}
    </span>
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
