<script>
  import { Node, Anchor } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";

  export let node;

  import { map } from "../Map.svelte";

  import {
    highlightAllFeatures,
    zoomToFeature,
  } from "../../utils/mapMovements.mjs";

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
</script>

<Node {...node} id={node.id}>
  <div class="node" let:grabHandle>
    <section class="node-wrapper container mx-3 my-3">
      <p>Source: {node.source}</p>
      <textarea
        class="text-white title bg-slate my-1 py-1 w-100"
        value={node.label}
        placeholder={node.label}
      />
      <textarea
        class="text-white body my-1 py-1"
        value={node.notes}
        placeholder="Enter notes"
      />

      <Dropzone
        on:drop={(e) => {
          handleFilesSelect(e, node.files);
          node = node;
        }}
        accept="image/*"
        containerClasses="dropzoneChart"
      />

      {#each node.files.accepted as item}
        <img src={URL.createObjectURL(item)} alt="preview" />
      {/each}

      <select
        class="text-white my-1 py-1"
        value={node.category}
        placeholder="Geospatial morphing"
      >
        {#each categories as category}
          <option value={category}>
            {category.text}
          </option>
        {/each}
      </select>

      <select
        class="text-white my-1 py-1"
        value={node.category}
        placeholder="Select a category"
      >
        {#each categories as category}
          <option value={category}>
            {category.text}
          </option>
        {/each}
      </select>

      <button
        on:click={() => {
          zoomToFeature(node.feature, map);
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
        connections={[node.source]}
      >
        <CustomAnchor {hovering} {connecting} {linked} />
      </Anchor>
    </span>
    <span class="anchor">
      <Anchor let:linked let:connecting let:hovering>
        <CustomAnchor {hovering} {connecting} {linked} />
      </Anchor>
    </span>
  </div>
</Node>

<style>
  .anchor,
  .anchor-top {
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
  textarea,
  :global(select) {
    background-color: #475569;
    border: 1px solid #ccc;
    border-radius: 5px;
    max-width: 80%;
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
    background-color: #ebcfab;
    border-radius: 8px;
    border: 3px solid black;
  }
</style>
