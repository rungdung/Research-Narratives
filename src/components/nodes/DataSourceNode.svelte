<script>
  import { Node, Anchor } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import CustomAnchor from "./customAnchor.svelte";
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
  </div>
  <span class="anchor">
    <Anchor let:linked let:connecting let:hovering>
      <CustomAnchor {hovering} {connecting} {linked} />
    </Anchor>
  </span>
</Node>

<style>
  .anchor {
    position: absolute;
    right: -24px;
    top: 45%;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
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
