<script lang="ts">
  import { onMount } from "svelte";

  const { text }: { text: string } = $props();

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
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const linkedText = input
      .split(urlRegex)
      .map((part) => {
        const nonHtml = escapeHtml(part);
        if (urlRegex.test(part))
          return `<a class="link" href="${part}" rel="noopener noreferrer" target="_blank">${nonHtml}</a>`;
        return nonHtml;
      })
      .join("");
    return linkedText;
  }
</script>

{#if isLoaded}
  {@html linkify(text)}
{/if}
