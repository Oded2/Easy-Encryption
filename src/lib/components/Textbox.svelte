<script lang="ts">
  import { showModal } from "$lib";
  import type { ChangeEventHandler, MouseEventHandler } from "svelte/elements";
  import Autolink from "./Autolink.svelte";
  import CopyButton from "./CopyButton.svelte";
  import { addToast } from "$lib/toasts";

  let {
    val = $bindable(),
    disabled,
    placeholder,
    spellcheck,
    isTrim,
    ondownload,
  }: {
    val: string;
    disabled?: boolean;
    placeholder?: string;
    spellcheck?: boolean;
    isTrim?: boolean;
    ondownload?: () => void;
  } = $props();

  const handleTrim: ChangeEventHandler<HTMLTextAreaElement> = () => {
    if (isTrim) val = val.trim();
  };

  const handleFile: ChangeEventHandler<HTMLInputElement> = (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") val = isTrim ? result.trim() : result;
      };
      reader.onerror = () => {
        addToast({
          type: "error",
          text: reader.error?.message ?? "Error reading file",
          duration: 5000,
        });
        console.error(reader.error);
      };
      reader.readAsText(file);
    }
    input.value = "";
  };

  const handlePaste: MouseEventHandler<HTMLButtonElement> = async () => {
    try {
      const clipboardText = await navigator.clipboard.readText();
      val = isTrim ? clipboardText.trim() : clipboardText;
    } catch (e) {
      console.error(e);
      addToast({
        text: "Failed to paste from clipboard",
        duration: 5000,
        type: "error",
      });
    }
  };

  const handleDownload: MouseEventHandler<HTMLButtonElement> = () => {
    if (ondownload) ondownload();
    showModal("download");
  };
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
      onchange={handleTrim}
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
