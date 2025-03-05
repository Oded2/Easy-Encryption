<script lang="ts">
  import type { Snippet } from "svelte";

  const { children }: { children: Snippet } = $props();
</script>

<label
  class="input input-ghost font-medium outline-hidden! border-1 border-gray-300! rounded-md"
>
  {@render children()}
</label>
