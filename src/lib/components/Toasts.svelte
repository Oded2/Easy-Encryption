<script lang="ts">
  import { flip } from "svelte/animate";
  import { toasts, dismissToast } from "../toasts";
  import Toast from "./Toast.svelte";

  const arr = $derived($toasts);
</script>

<section class="fixed bottom-2 left-2 flex flex-col gap-4 print:hidden">
  {#each arr as toast (toast.id)}
    <div animate:flip={{ duration: 200 }}>
      <Toast
        type={toast.type}
        duration={toast.duration}
        handleClose={() => dismissToast(toast.id)}
      >
        {toast.text}
      </Toast>
    </div>
  {/each}
</section>
