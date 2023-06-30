<script>
  import { Node, Anchor } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import CustomAnchor from "./customAnchor.svelte";
  export let sourceNode;
  import { uploadedSources } from "../../stores";

  let position;
  function updatePosition() {
    if (position != null) {
      uploadedSources.update((nodes) => {
        let index = nodes.findIndex((node) => node.id == sourceNode.id);
        nodes[index].position = position;
        return nodes;
      });
    }
  }
</script>

<Node
  {...sourceNode}
  id={sourceNode.fileName}
  useDefaults
  bind:position
  on:nodeClicked={updatePosition}
>
  <div class="node" let:grabHandle>
    <div class="node-wrapper">
      <h3 class="text-3xl">{sourceNode.fileName}</h3>
      <li>Type: {sourceNode.type}</li>
      {#if sourceNode.type === "Spatial"}
        <li>Geometry: {sourceNode.geometry}</li>
      {/if}
      <li>Source: {sourceNode.source}</li>
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
    background-color: #dbdbdb;
    border-radius: 8px;
    border: 5px solid black;
  }
  .node-wrapper {
    margin: 1em;
    max-width: 15em;
    border-radius: 2px;
    background-color: #cccccc;
    line-break: after-white-space;
  }
</style>
