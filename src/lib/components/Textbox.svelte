<script lang="ts">
  export let val: string;
  export let disabled: boolean = false;
  export let placeholder: string = "";
</script>

{#if disabled}
  <div
    class="textarea textarea-ghost focus:outline-none border-none w-full px-0 h-full my-5 text-lg font-medium break-words"
  >
    <p class="max-w-full">{val}</p>
  </div>
{:else}
  <textarea
    class="textarea textarea-ghost focus:outline-none border-none w-full px-0 h-full my-5 resize-none text-lg font-medium"
    {placeholder}
    bind:value={val}
  ></textarea>
{/if}
