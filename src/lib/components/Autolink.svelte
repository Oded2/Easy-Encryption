<script lang="ts">
  import Autolinker from "autolinker";
  import { onMount } from "svelte";

  const { text }: { text: string } = $props();
  const autoLinker = new Autolinker({
    className: "link",
    stripPrefix: false,
    sanitizeHtml: true,
  });

  let isLoaded: boolean = $state(false);

  onMount(() => (isLoaded = true));
</script>

{#if isLoaded}
  {@html autoLinker.link(text)}
{/if}
