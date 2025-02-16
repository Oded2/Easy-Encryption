<script lang="ts">
  let {
    text = "",
    state = $bindable(false),
    disclaimer = "",
  }: {
    text?: string;
    state: boolean;
    disclaimer?: string;
  } = $props();
</script>

<div class="label justify-center gap-2">
  {#if disclaimer.length > 0}
    <div class="tooltip" data-tip={disclaimer}>
      <i class="fa-solid fa-circle-exclamation"></i>
    </div>
  {/if}
  {#if text.length > 0}
    <span class="label-text">{text}</span>
  {/if}
  <input type="checkbox" class="toggle" bind:checked={state} />
</div>
