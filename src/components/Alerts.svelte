<script>
  import { uploadedSources, markupNodes } from "../stores";
  import { Toast, Button } from "flowbite-svelte";
  import { onMount } from "svelte";

  let show = true;
  let counter = 7;
  export let pos;
  export let content;

  function timeout() {
    if (--counter > 0) return setTimeout(timeout, 1000);
    show = false;
  }

  // trigger timer on mount
  onMount(() => {
    timeout();
  });
</script>

{#if pos == "bottom"}
  <Toast
    bind:open={show}
    color="green"
    class="absolute bottom-3 left-0 right-0 mx-auto w-60 text-black"
  >
    {content}
  </Toast>
{/if}

{#if pos == "right"}
  <Toast
    bind:open={show}
    color="green"
    class="absolute z-10 right-10 top-40 mx-auto w-50  text-black"
  >
    {content}
  </Toast>
{/if}
