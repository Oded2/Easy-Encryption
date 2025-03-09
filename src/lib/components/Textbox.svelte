<script lang="ts">
  import { showModal } from "$lib";
  import Autolink from "./Autolink.svelte";
  import CopyButton from "./CopyButton.svelte";

  let {
    val = $bindable(),
    disabled,
    placeholder,
    spellcheck,
    handleFile,
    handlePaste,
    ondownload,
    onchange,
  }: {
    val: string;
    disabled?: boolean;
    placeholder?: string;
    spellcheck?: boolean;
    handleFile?: (...args: any[]) => void;
    handlePaste?: (...args: any[]) => void;
    ondownload?: () => void;
    onchange?: () => void;
  } = $props();

  function handleDownload(): void {
    if (ondownload) ondownload();
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
      class="textarea textarea-ghost focus:outline-hidden border-none w-full px-0 h-64 md:h-80 resize-none text-lg print:hidden"
      {placeholder}
      {onchange}
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
              onchange={handleFile}
            />
          </label>
        </div>
      {/if}
      {#if disabled}
        <CopyButton text={val} className="btn btn-square join-item text-xl">
          <i class="fa-solid fa-copy"></i>
        </CopyButton>
      {:else}
        <div class="tooltip" data-tip="Paste from Clipboard">
          <button
            onclick={handlePaste}
            class="btn btn-square join-item text-xl"
            aria-label="Paste from Clipboard"
          >
            <i class="fa-solid fa-paste"></i>
          </button>
        </div>
      {/if}
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
