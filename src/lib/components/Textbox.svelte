<script lang="ts">
  export let val: string;
  export let disabled: boolean = false;
  export let placeholder: string = "";
</script>

<div class="relative w-full">
  {#if disabled}
    <div
      class="textarea textarea-ghost focus:outline-none border-none w-full px-0 h-96 text-lg font-medium break-words overflow-auto"
    >
      {val.length > 0 ? val : placeholder}
    </div>
  {:else}
    <textarea
      class="textarea textarea-ghost focus:outline-none border-none w-full px-0 h-96 resize-none text-lg font-medium"
      {placeholder}
      bind:value={val}
    >
    </textarea>
  {/if}
  <button
    on:click
    aria-label={disabled ? "Copy to Clipboard" : "Paste from Clipboard"}
    class="absolute end-2 bottom-2 hover:scale-110 duration-100 text-xl"
    title="Paste from Clipboard"
  >
    {#if disabled}
      <i class="fa-solid fa-copy"></i>
    {:else}
      <i class="fa-solid fa-paste"></i>{/if}
  </button>
</div>
