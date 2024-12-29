<script lang="ts">
  import DOMPurify from "dompurify";

  const { text }: { text: string } = $props();

  function linkify(input: string): string {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const linkedText = input
      .split(urlRegex)
      .map((part) => {
        if (urlRegex.test(part))
          return `<a class="link" href="${part}" rel="noopener noreferrer" target="_blank">${part}</a>`;
        return part;
      })
      .join("");
    return DOMPurify.sanitize(linkedText);
  }
</script>

{@html linkify(text)}
