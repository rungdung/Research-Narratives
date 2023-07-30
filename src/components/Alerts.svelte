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
    simple
    bind:open={show}
    color="green"
    divClass="absolute bottom-3 left-0 right-0 mx-auto w-40 px-4 py-1 text-black bg-primary-100 "
  >
    {content}
  </Toast>
{/if}

{#if pos == "right"}
  <Toast
    simple
    bind:open={show}
    color="green"
    divClass="absolute z-10 right-10 top-40 mx-auto w-40 px-4 py-1 text-black bg-primary-100 text-left"
  >
    {content}
  </Toast>
{/if}

<style>
  .alert {
    background-color: #f1f1f1;
    color: black;
    padding: 2px !important;
    margin-bottom: 0px;
  }
</style>
