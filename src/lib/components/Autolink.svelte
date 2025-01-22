<script lang="ts">
  import { onMount } from "svelte";
  import { find, test } from "linkifyjs";

  const { text }: { text: string } = $props();

  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };

  let isLoaded: boolean = $state(false);

  onMount(() => (isLoaded = true));

  function escapeHtml(str: string): string {
    return str.replace(/[&<>"']/g, (m) => map[m]);
  }

  function linkify(input: string): string {
    const finds = find(input, { defaultProtocol: "https" });
    const findValues = finds.map((part) => part.value).join("|");
    const regex = new RegExp(`(${findValues})`, "g");
    return input
      .split(regex)
      .map((part) => {
        if (test(part)) return handleURL(part, finds);
        return escapeHtml(part);
      })
      .join("");
  }

  function handleURL(
    part: string,
    finds: {
      type: string;
      value: string;
      isLink: boolean;
      href: string;
      start: number;
      end: number;
    }[]
  ): string {
    const link = finds.find((val) => val.value === part)!;
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
