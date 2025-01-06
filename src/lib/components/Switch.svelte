<script lang="ts">
  let {
    text = "",
    state = $bindable(false),
  }: { checked?: boolean; text?: string; state: boolean } = $props();
</script>

<div class="flex flex-col">
  <label class="label cursor-pointer justify-center gap-2">
    {#if text.length > 0}
      <span class="label-text">{text}</span>
    {/if}
    <input type="checkbox" class="toggle" checked={state} />
  </label>
</div>
