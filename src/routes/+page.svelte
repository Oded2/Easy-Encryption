<script lang="ts">
  import Password from "./../lib/components/Password.svelte";
  import Textbox from "$lib/components/Textbox.svelte";
  let encrypted: string;
</script>

<div class="container mx-auto px-2 sm:px-0 my-10 font-quicksand">
  <div class="md:grid grid-cols-2 lg:h-96">
    <div class="col-auto">
      <h1 class="font-bold text-5xl">Enter Text to Encrypt</h1>
      <Textbox bind:val={encrypted}></Textbox>
      <div class="border-b-2 mb-5"></div>
      <Password></Password>
    </div>
    <div class="col-auto">hello earth</div>
  </div>
</div>
