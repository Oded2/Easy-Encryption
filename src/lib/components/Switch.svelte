<script lang="ts">
  import type { ChangeEventHandler } from "svelte/elements";

  let {
    text,
    state = $bindable(false),
    disclaimer,
    onchange,
  }: {
    text?: string;
    state: boolean;
    disclaimer?: string;
    onchange?: ChangeEventHandler<HTMLInputElement>;
  } = $props();
</script>

<div class="flex justify-center gap-2">
  {#if disclaimer}
    <div class="tooltip" data-tip={disclaimer}>
      <i class="fa-solid fa-circle-exclamation"></i>
    </div>
  {/if}
  {#if text}
    <span>{text}</span>
  {/if}
  <input type="checkbox" class="toggle" bind:checked={state} {onchange} />
</div>
