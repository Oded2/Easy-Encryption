<script lang="ts">
  import { page } from "$app/state";
  import { onMount } from "svelte";

  onMount(() => (document.title = `${page.status} Error`));
</script>

<div class="flex h-screen w-full flex-col items-center justify-center gap-2">
  <h1 class="text-7xl">{page.status}</h1>
  <h2 class="text-3xl">{page.error?.message}</h2>
  <a href="/" class="btn btn-neutral mt-2 rounded-3xl">Back to Home</a>
</div>
