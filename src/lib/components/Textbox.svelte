<script lang="ts">
  let {
    val = $bindable(),
    disabled = false,
    placeholder = "",
    tip,
    onchange = () => {},
    onclick,
  }: {
    val: string;
    disabled?: boolean;
    placeholder?: string;
    tip: string;
    onchange?: (...args: any[]) => void;
    onclick: (...args: any[]) => void;
  } = $props();
</script>

<div class="relative w-full">
  {#if disabled}
    <div
      class="textarea textarea-ghost border-none w-full px-0 h-64 md:h-96 text-lg font-medium overflow-auto"
    >
      <p class="break-words whitespace-pre-wrap" dir="auto">
        {val.length > 0 ? val : placeholder}
      </p>
    </div>
  {:else}
    <textarea
      dir="auto"
      class="textarea textarea-ghost focus:outline-none border-none w-full px-0 h-64 md:h-96 resize-none text-lg font-medium"
      {placeholder}
      bind:value={val}
    >
    </textarea>
  {/if}
  <div class="absolute end-2 bottom-2 join">
    {#if disabled}
      <div class="tooltip" data-tip="Download Text">
        <a
          aria-label="Download"
          href="data:text;charset=utf-8,{val}"
          download="Text.txt"
          class="btn btn-circle join-item text-xl"
        >
          <i class="fa-solid fa-cloud-arrow-down"></i>
        </a>
      </div>
    {:else}
      <div class="tooltip" data-tip="Upload Text">
        <label
          aria-label="Upload Text"
          class="btn btn-circle join-item text-xl"
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

    <div class="tooltip" data-tip={tip}>
      <button
        {onclick}
        aria-label={disabled ? "Copy to Clipboard" : "Paste from Clipboard"}
        class="btn btn-circle join-item text-xl"
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
