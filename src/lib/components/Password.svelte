<script lang="ts">
  import type {
    HTMLInputTypeAttribute,
    MouseEventHandler,
  } from "svelte/elements";
  import InputLabel from "./InputLabel.svelte";
  import type { Snippet } from "svelte";

  let {
    password = $bindable(),
    placeholder,
    children,
  }: { password: string; placeholder: string; children?: Snippet } = $props();

  let type: HTMLInputTypeAttribute = $state("password");

  const changeType: MouseEventHandler<HTMLButtonElement> = () => {
    type = type === "text" ? "password" : "text";
  };
</script>

<div class="w-full sm:w-80 md:mx-0">
  <InputLabel>
    <input
      bind:value={password}
      {type}
      autocomplete="off"
      spellcheck="false"
      class="grow"
      {placeholder}
      data-1p-ignore
      data-lpignore="true"
      data-bwignore
      data-form-type="other"
    />
    <button
      aria-label="Show Password"
      type="button"
      class="text-gray-500 cursor-pointer"
      onclick={changeType}
    >
      {#if type === "password"}
        <i class="fa-solid fa-eye"></i>
      {:else if type === "text"}
        <i class="fa-solid fa-eye-slash"></i>
      {/if}
    </button>
    {#if children}
      <div class="cursor-auto">
        {@render children()}
      </div>
    {/if}
  </InputLabel>
</div>
