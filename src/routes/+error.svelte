<script lang="ts">
  import { page } from "$app/stores";
  const url = $page;
</script>

<div class="flex h-screen w-full flex-col items-center justify-center gap-2">
  <h1 class="text-7xl">{url.status}</h1>
  <h2 class="text-3xl">{url.error?.message}</h2>
  <a href="/" class="btn btn-neutral mt-2 rounded-3xl">Back to Home</a>
</div>

<svelte:head><title>{`${url.status} Error`}</title></svelte:head>
