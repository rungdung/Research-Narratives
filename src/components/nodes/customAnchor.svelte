<script>
  import { P } from "flowbite-svelte";

  export let linked;
  export let connecting;
  export let hovering;

  export let label;
  export let color;
</script>

<div class:linked class:hovering class:connecting class="my-anchor bg-{color}">
  {#if label}
    <p id="label" class="text-xl text-base/loose">
      {label}
    </p>
  {/if}
</div>

<style>
  #label {
    display: inline-block;
    transform: translate(10%, -35%);
    width: 10em;
  }
  .my-anchor {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: solid 4px white;
    border-color: inherit;
  }
  .hovering {
    scale: 1.2;
  }
  .linked {
    background-color: rgb(0, 0, 0) !important;
  }
  .connecting {
    background-color: goldenrod;
    animation: pulse 1s infinite;
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 goldenrod;
    }
    70% {
      box-shadow: 0 0 0 10px rgba(255, 0, 0, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(255, 0, 0, 0);
    }
  }
</style>
