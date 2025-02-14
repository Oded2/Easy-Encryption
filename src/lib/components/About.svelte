<script lang="ts">
  let checked: boolean = $state(true);
</script>

<div class="collapse">
  <input type="checkbox" bind:checked />
  <div class="collapse-title text-xl font-medium">
    About
    <i class="fa-solid fa-caret-down transition" class:rotate-180={checked}></i>
  </div>
  <div class="collapse-content prose">
    <article>
      <h3>What is <span class="italic">Easy Encryption</span>?</h3>
      <p class="font-medium">
        Easy Encryption is a simple tool that allows for text encryption &amp;
        decryption without any hassle. Easy Encryption provides the user with a
        nice, clean user interface that&apos;s easy to use.
      </p>
      <p class="font-medium">
        Easy Encryption uses AES (Advanced Encryption Standard) for encrypting
        &amp; decrypting text.
      </p>
    </article>
    <article>
      <h3>How do I encrypt text?</h3>
      <ol class="font-medium">
        <li>
          Select the <span class="italic">Encrypt</span> tab at the navbar.
        </li>
        <li>Insert the text that you would like to encrypt.</li>
        <li>
          Enter a password under the original text, or leave it blank if you
          don&apos;t wish to secure it with one.
        </li>
        <li>
          Your encrypted text is automatically shown under the <span
            class="italic">Encrypted Text</span
          > section.
        </li>
      </ol>
    </article>
    <article>
      <h3>How do I decrypt text?</h3>
      <ol class="font-medium">
        <li>
          Select the <span class="italic">Decrypt</span> tab at the navbar.
        </li>
        <li>Insert the text that you would like to decrypt.</li>
        <li>
          Enter the password under the <span class="italic"
            >Enter Encrypted Text</span
          > section. If the encrypted text wasn&apos;t secured with a password, then
          the text will be automatically decrypted.
        </li>
        <li>
          The decrypted text is automatically shown under the <span
            class="italic">Decrypted Text</span
          > section.
        </li>
      </ol>
    </article>
    <article>
      <h3>What do compress &amp; decompress do?</h3>
      <p class="font-medium">
        When encrypting text, you might find your text to be too lengthy.
        That&apos;s when a compress/decompress feature can come in useful. After
        compressing, you will see text that looks like gibberish, however, you
        will also notice the character count go down.
      </p>
      <p class="font-medium">
        When decrypting a text that has been compressed, you will see the same
        &quot;gibberish&quot; as mentioned above. To decompress, simply click
        the decompress button.
      </p>
      <strong>Notes</strong>
      <ul class="font-medium">
        <li>Compression only works best on long, repetitive text.</li>
        <li>
          When compressing, Easy Encryption automatically checks if the
          compressed text is longer than the original text (this usually happens
          when compressing non-repetitive text), and if it is, then it
          won&apos;t compress the text in order to provide a better user
          experience.
        </li>
      </ul>
    </article>
  </div>
</div>
