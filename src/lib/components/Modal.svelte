<script lang="ts">
  import type { Snippet } from "svelte";

  const { id, children }: { id: string; children: Snippet } = $props();
</script>

<dialog {id} class="modal">
  <div class="modal-box">
    {@render children()}
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
