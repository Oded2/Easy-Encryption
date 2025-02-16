<script lang="ts">
  import { showModal } from "$lib";
  import Autolink from "./Autolink.svelte";

  let {
    val = $bindable(),
    disabled = false,
    placeholder = "",
    tip,
    spellcheck = false,
    onchange = () => {},
    onclick,
    ondownload = () => {},
  }: {
    val: string;
    disabled?: boolean;
    placeholder?: string;
    tip: string;
    spellcheck?: boolean;
    onchange?: (...args: any[]) => void;
    onclick: (...args: any[]) => void;
    ondownload?: () => void;
  } = $props();

  function handleDownload(): void {
    ondownload();
    showModal("download");
  }
</script>

<div class="flex flex-col w-full">
  {#if disabled}
    {@render display()}
  {:else}
    <textarea
      dir="auto"
      {spellcheck}
      class="textarea textarea-ghost focus:outline-none border-none w-full px-0 h-64 md:h-80 resize-none text-lg print:hidden"
      {placeholder}
      bind:value={val}
    >
    </textarea>
    <div class="hidden print:block">
      {@render display()}
    </div>
  {/if}
  <div class="m-2 flex items-baseline gap-2 justify-between">
    <span>{`Character count: ${val.length.toLocaleString()}`}</span>
    <div class="join print:hidden">
      {#if disabled}
        <div class="tooltip join-item" data-tip="Download Text">
          <button
            aria-label="Download"
            onclick={handleDownload}
            class="btn btn-square join-item text-xl"
          >
            <i class="fa-solid fa-cloud-arrow-down"></i>
          </button>
        </div>
      {:else}
        <div class="tooltip join-item" data-tip="Upload Text">
          <label
            aria-label="Upload Text"
            class="btn btn-square join-item text-xl"
          >
            <i class="fa-solid fa-cloud-arrow-up"></i>
            <input
              type="file"
              accept="text/*,.py,.cs,.ts,.js,.json,.html,.css,.xml,.md,.sh,.java"
              class="hidden"
              {onchange}
            />
          </label>
        </div>
      {/if}
      <div class="tooltip join-item" data-tip={tip}>
        <button
          {onclick}
          aria-label={disabled ? "Copy to Clipboard" : "Paste from Clipboard"}
          class="btn btn-square join-item text-xl"
        >
          {#if disabled}
            <i class="fa-solid fa-copy"></i>
          {:else}
            <i class="fa-solid fa-paste"></i>
          {/if}
        </button>
      </div>
    </div>
  </div>
</div>

{#snippet display()}
  <div
    class="textarea textarea-ghost border-none w-full px-0 text-lg overflow-auto h-64 md:h-80 print:h-auto"
  >
    <p class="break-words whitespace-pre-wrap" dir="auto">
      {#if val.length > 0}
        <Autolink text={val}></Autolink>
      {:else}
        <span class="italic">{placeholder}</span>
      {/if}
    </p>
  </div>
{/snippet}
