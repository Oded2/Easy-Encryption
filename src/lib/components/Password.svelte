<script lang="ts">
  import type { HTMLInputTypeAttribute } from "svelte/elements";
  import InputLabel from "./InputLabel.svelte";

  let { password = $bindable() }: { password: string } = $props();

  const placeholder = "Enter password";

  let type: HTMLInputTypeAttribute = $state("text");

  function changeType() {
    type = type === "text" ? "password" : "text";
  }
</script>

<div class="w-full sm:w-80 md:mx-0 font-medium">
  <InputLabel>
    <input
      bind:value={password}
      {type}
      autocomplete="off"
      spellcheck="false"
      class="grow"
      {placeholder}
    />
    <button
      aria-label="Show Password"
      type="button"
      class="text-gray-500 cursor-pointer"
      onclick={changeType}
    >
      {#if type === "text"}
        <i class="fa-solid fa-eye"></i>
      {:else if type === "password"}
        <i class="fa-solid fa-eye-slash"></i>
      {/if}
    </button>
  </InputLabel>
</div>
