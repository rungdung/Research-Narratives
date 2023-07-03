<script>
  import { Node, Anchor, generateOutput, generateInput } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";

  export let markupNode;

  import { map } from "../Map.svelte";

  import { zoomToFeature } from "../../utils/mapMovements.mjs";

  import { markupNodes } from "../../stores";

  import CustomAnchor from "./customAnchor.svelte";
  import AnimatedEdge from "./customAnimatedEdge.svelte";

  let categories = [
    { text: "Category 1", value: "1" },
    { text: "Category 2", value: "2" },
    { text: "Category 3", value: "3" },
  ];

  function handleFilesSelect(e, files) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
  }

  let inputs = generateInput({
    mapFeature: markupNode.feature,
  });
  const processor = ($inputs) => {
    console.log($inputs.mapFeature);
    return $inputs;
  };
  const output = generateOutput(inputs, processor);

  let position;
  function updatePosition() {
    markupNodes.update((nodes) => {
      let index = nodes.findIndex((node) => node.id == markupNode.id);
      nodes[index].position = position;
      return nodes;
    });
  }
</script>

<Node
  {...markupNode}
  id={markupNode.id}
  let:grabHandle
  bind:position
  on:nodeClicked={updatePosition}
>
  <div class="node" use:grabHandle>
    <section class="node-wrapper container mx-3 my-3">
      <h2 class="text-2xl text-white whitespace-normal">
        {markupNode.label}
      </h2>
      <textarea
        class="text-white body my-1 py-1"
        value={markupNode.notes}
        placeholder="Enter notes"
      />

      <Dropzone
        on:drop={(e) => {
          handleFilesSelect(e, markupNode.files);
          markupNode = markupNode;
        }}
        accept="image/*"
        containerClasses="dropzoneChart"
      />

      {#each markupNode.files.accepted as item}
        <img src={URL.createObjectURL(item)} alt="preview" />
      {/each}

      <select
        class="text-white my-1 py-1"
        value={markupNode.category}
        placeholder="Geospatial morphing"
      >
        {#each categories as category}
          <option value={category}>
            {category.text}
          </option>
        {/each}
      </select>

      <button
        on:click={() => {
          zoomToFeature(markupNode.feature, map);
        }}
        class="bg-slate-800"
      >
        Open Source document / event
      </button>
    </section>
    <span class="anchor-top">
      <Anchor
        edge={AnimatedEdge}
        let:linked
        let:connecting
        let:hovering
        multiple={false}
        direction="north"
        connections={[markupNode.source]}
      >
        <CustomAnchor {hovering} {connecting} {linked} />
      </Anchor>
    </span>
    <span class="anchor">
      <Anchor let:linked let:connecting let:hovering>
        <CustomAnchor {hovering} {connecting} {linked} />
      </Anchor>
    </span>
    <span class="anchor-right">
      <Anchor
        let:linked
        let:connecting
        let:hovering
        outputStore={output}
        key="mapFeature"
        output
      >
        <CustomAnchor {hovering} {connecting} {linked} label="Data" />
      </Anchor>
    </span>
  </div>
</Node>

<style>
  .anchor,
  .anchor-top,
  .anchor-right {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .anchor {
    bottom: -10%;
    left: 50%;
  }

  .anchor-top {
    top: -10%;
    left: 50%;
  }
  .anchor-right {
    top: 50%;
    right: -5%;
  }
  textarea,
  :global(select) {
    background-color: #475569;
    border: 1px solid #ccc;
    border-radius: 5px;
    color: white;

    padding: 0.2em !important;
    margin-right: 0.5em !important;
  }
  .title,
  .body {
    width: 90%;
    height: fit-content;
  }
  .title {
    height: 3em;
    font-size: larger;
  }
  .node-wrapper {
    margin: 1em;
    width: 90%;
  }
  :global(.dropzone) {
    border: 1px solid #ccc;
    border-radius: 5px;
    max-width: 80%;
    padding: 0.2em !important;
    margin-right: 0.5em !important;
  }

  :global(.dropzoneChart) {
    max-width: 90%;
  }
  button {
    margin-top: 0.2em;
    size: 1em;
    padding: 0.2em 0.5em;
  }

  .node {
    width: 100%;
    height: 100%;
    min-width: 3em;
    max-width: 25em;
    background-color: #5e6b6a;
    border-radius: 8px;
    border: 3px solid black;
  }
</style>