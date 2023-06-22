<script>
  import { Node, Anchor } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";

  export let node;
</script>

<Node {...node} id={node.fileName} useDefaults>
  <div class="node" let:grabHandle>
    <div class="node-wrapper">
      <h3 class="text-3xl">{node.fileName}</h3>
      <li>Type: {node.type}</li>
      {#if node.type === "Spatial"}
        <li>Geometry: {node.geometry}</li>
      {/if}
      <li>Source: {node.source}</li>
    </div>
    <Anchor direction="west" />
  </div>
</Node>

<style>
  .node {
    width: 100%;
    height: 100%;
    min-width: 3em;
    max-width: 50em;
    background-color: #ebcfab;
    border-radius: 8px;
    border: 5px solid black;
  }
  .node-wrapper {
    margin: 1em;
    max-width: 15em;
    border-radius: 2px;
    background-color: #ebcfab;
    line-break: after-white-space;
  }
</style>
