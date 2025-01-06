<script lang="ts">
  let {
    text = "",
    state = $bindable(false),
    disclaimer = "",
  }: {
    checked?: boolean;
    text?: string;
    state: boolean;
    disclaimer?: string;
  } = $props();
</script>

<div class="flex flex-col">
  <label class="label cursor-pointer justify-center gap-2">
    {#if disclaimer.length > 0}
      <div class="tooltip cursor-default" data-tip={disclaimer}>
        <i class="fa-solid fa-circle-exclamation"></i>
      </div>
    {/if}
    {#if text.length > 0}
      <span class="label-text">{text}</span>
    {/if}
    <input type="checkbox" class="toggle" bind:checked={state} />
  </label>
</div>
