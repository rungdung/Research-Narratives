<script>
  import { Node, Anchor } from "svelvet";
  import CustomAnchor from "./customAnchor.svelte";
  import { uploadedSources } from "../../stores";
  import { Input, Textarea, Label } from "flowbite-svelte";

  export let sourceNode;
  let position;
  function updatePosition() {
    if (position != null) {
      uploadedSources.update((nodes) => {
        let index = nodes.findIndex(
          (node) => node.fileName == sourceNode.fileName
        );
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
      <h3 class="text-3xl my-3">{sourceNode.fileName}</h3>
      <ul class="text-lg">
        <li>Type: {sourceNode.type}</li>
        {#if sourceNode.type === "Spatial"}
          <li>Geometry: {sourceNode.geometry}</li>
        {/if}
        <li>
          {#if sourceNode.source}
            Source: {sourceNode.source}
          {:else}
            <Label for="Source" class="!text-black text-lg">Source</Label>
            <Input placeholder="please provide a source link" name="citation" />
          {/if}
        </li>
        <li>
          <Label for="citation" class="!text-black text-lg">Citation</Label>
          <Textarea
            placeholder="please provide a citation before sharing"
            name="citation"
          />
        </li>
      </ul>
    </div>
  </div>
  <span class="anchor">
    <Anchor let:linked let:connecting let:hovering direction="south">
      <CustomAnchor {hovering} {connecting} {linked} />
    </Anchor>
  </span>
</Node>

<style>
  .anchor {
    position: absolute;
    right: 50%;
    bottom: -15%;
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
