<script lang="ts">
  import DOMPurify from "dompurify";

  const { text }: { text: string } = $props();

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
        if (urlRegex.test(part))
          return `<a class="link" href="${part}" rel="noopener noreferrer" target="_blank">${part}</a>`;
        return escapeHtml(part);
      })
      .join("");
    return DOMPurify.sanitize(linkedText);
  }
</script>

{@html linkify(text)}
