<script lang="ts">
  import { onMount } from "svelte";
  import { find, test } from "linkifyjs";

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
    return input
      .split(" ")
      .map((part) => {
        if (test(part)) return handleURL(part);
        return escapeHtml(part);
      })
      .join(" ");
  }

  function handleURL(part: string): string {
    const link = find(part, { defaultProtocol: "https" })[0];
    const anchor = document.createElement("a");
    anchor.href = link.href;
    anchor.className = "link";
    anchor.rel = "noopener noreferrer";
    anchor.target = "_blank";
    anchor.innerText = link.value;
    return anchor.outerHTML;
  }
</script>

{#if isLoaded}
  {@html linkify(text)}
{/if}
