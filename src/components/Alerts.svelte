<script>
  import { uploadedSources, markupNodes } from "../stores";
  import { Toast, Button } from "flowbite-svelte";

  let show = true;
  let counter = 7;
  function trigger() {
    show = true;
    counter = 7;
    timeout();
  }
  function timeout() {
    if (--counter > 0) return setTimeout(timeout, 1000);
    show = false;
  }
</script>

{#key $uploadedSources}
  {#if $uploadedSources.length > 0}
    {trigger()}
    <Toast
      color="green"
      class="absolute bottom-3 left-0 right-0 mx-auto w-60 text-black"
    >
      <span
        ><b>{$uploadedSources[$uploadedSources.length - 1].fileName}</b></span
      >
      <span class="font-medium">has been uploaded :D</span>
    </Toast>
  {/if}
{/key}

{#key $markupNodes.length}
  {#if $markupNodes.length > 0}
    {trigger()}
    <Toast
      bind:open={show}
      color="green"
      class="absolute z-10 right-10 top-40 mx-auto w-50  text-black"
    >
      <span class="font-medium"
        >Feature from <b>{$markupNodes[$markupNodes.length - 1].source}</b> is now
        available for annotation</span
      >
    </Toast>
  {/if}
{/key}
