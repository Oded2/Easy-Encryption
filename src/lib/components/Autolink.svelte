<script lang="ts">
  import { onMount } from "svelte";

  const { text }: { text: string } = $props();

  const urlRegex = /(https?:\/\/[^\s]+)/g;

  let isLoaded: boolean = $state(false);

  onMount(() => (isLoaded = true));

  function escapeHtml(str: string): string {
    const map: { [key: string]: string } = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return str.replace(/[&<>"']/g, (m) => map[m]);
  }

  function linkify(input: string): string {
    const linkedText = input
      .split(urlRegex)
      .map((part) => {
        if (urlRegex.test(part)) return createAnchorElement(part);
        return escapeHtml(part);
      })
      .join("");
    return linkedText;
  }

  function createAnchorElement(part: string): string {
    const anchor = document.createElement("a");
    anchor.href = part;
    anchor.className = "link";
    anchor.rel = "noopener noreferrer";
    anchor.target = "_blank";
    anchor.innerText = text;
    return anchor.outerHTML;
  }
</script>

{#if isLoaded}
  {@html linkify(text)}
{/if}
