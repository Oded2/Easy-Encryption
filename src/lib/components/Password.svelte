<script lang="ts">
  import "@fortawesome/fontawesome-free/css/all.min.css";

  let hidePass = true;
  let password: string;
</script>

<div class="relative max-w-xs">
  {#if hidePass}
    <input
      type="password"
      class="input input-bordered !outline-none w-full pr-10"
      placeholder="Enter your password"
      bind:value={password}
    />
  {:else}
    <input
      type="text"
      class="input input-bordered !outline-none w-full pr-10"
      placeholder="Enter your password"
      bind:value={password}
    />
  {/if}
  <button
    aria-label="Show Password"
    type="button"
    class="absolute end-2 top-3 text-gray-500"
    on:click={() => (hidePass = !hidePass)}
  >
    {#if hidePass}
      <i class="fa-solid fa-eye"></i>
    {:else}
      <i class="fa-solid fa-eye-slash"></i>
    {/if}
  </button>
</div>
