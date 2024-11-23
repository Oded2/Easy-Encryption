<script lang="ts">
  export let id: string;
</script>

<dialog {id} class="modal">
  <div class="modal-box">
    <slot></slot>
  </div>
  <form method="dialog" class="modal-backdrop">
    <button>close</button>
  </form>
</dialog>
