<script lang="ts">
  export let val: string;
</script>

<textarea
  class="textarea textarea-ghost focus:outline-none border-none w-full px-0 h-full my-5 resize-none text-lg font-medium"
  placeholder="Place Text Here"
  bind:value={val}
></textarea>
