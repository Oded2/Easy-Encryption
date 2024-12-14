<script lang="ts">
  let { password = $bindable() }: { password: string } = $props();

  const placeholder = "Enter password";

  let hidePass = $state(true);
</script>

<div class="relative w-full sm:w-80 md:mx-0">
  {#if hidePass}
    <input
      type="password"
      dir="auto"
      autocomplete="off"
      spellcheck="false"
      class="input input-bordered !outline-none w-full pr-10 font-medium"
      {placeholder}
      bind:value={password}
    />
  {:else}
    <input
      type="text"
      dir="auto"
      autocomplete="off"
      spellcheck="false"
      class="input input-bordered !outline-none w-full pr-10 font-medium"
      {placeholder}
      bind:value={password}
    />
  {/if}
  <button
    aria-label="Show Password"
    type="button"
    class="absolute end-2 top-3 text-gray-500"
    onclick={() => (hidePass = !hidePass)}
  >
    {#if hidePass}
      <i class="fa-solid fa-eye"></i>
    {:else}
      <i class="fa-solid fa-eye-slash"></i>
    {/if}
  </button>
</div>
