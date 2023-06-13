<script>
  import "leaflet";
  import { map } from "./Map.svelte";
  import { selectedFeatures } from "./stores.js";
  import { onMount } from "svelte";

  import { highlightAllFeatures, zoomToFeature } from "./libs/mapMovements.mjs";

  import {
    Node,
    Minimap,
    Controls,
    Resizer,
    Anchor,
    Background,
    Svelvet,
    Drawer,
  } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";

  let highlightLayer = new L.FeatureGroup();

  let edges = [];

  export let width;
  export let height;
  let nodes = [];
  let lastValue;

  let categories = [
    { text: "Category 1", value: "1" },
    { text: "Category 2", value: "2" },
    { text: "Category 3", value: "3" },
  ];

  // read from subscribed store
  // if reloading, load all from store
  // else load from local storage
  onMount(() => {
    nodes = [];
    nodes = nodes;
  });

  $: if ($selectedFeatures.length > 0) {
    lastValue = $selectedFeatures[$selectedFeatures.length - 1];

    nodes.push({
      label: lastValue.title,
      width: 220,
      notes: "",
      feature: lastValue.feature,
      files: {
        accepted: [],
        rejected: [],
      },
    });

    nodes = nodes;
  }

  function handleFilesSelect(e, files) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
  }
</script>

<div id="events-in-focus">
  <Svelvet id={"mindmap-canvas"} {height} editable={true} >
      <Background bgColor="#faebd7" slot="background" />
      {#each nodes as node}
        <Node {...node} let:grabHandle drop={true}  editable={true}>
          <div class="node">
            <section class="container mx-3 my-3">
              <h2>{node.label}</h2>
              <input
                class="text-white my-1"
                value={node.notes}
                placeholder="Enter notes"
              />

              <select
                class="text-white my-1"
                value={node.category}
                placeholder="Select a category"
              >
                {#each categories as category}
                  <option value={category}>
                    {category.text}
                  </option>
                {/each}
              </select>

              <Dropzone
                on:drop={(e) => {
                  handleFilesSelect(e, node.files);
                  nodes = nodes;
                }}
                accept="image/*"
                containerClasses="dropzone"
              />

              {#each node.files.accepted as item}
                <img src={URL.createObjectURL(item)} alt="preview" />
              {/each}

              <select
                class="text-white my-1"
                value={node.category}
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
                  zoomToFeature(node.feature, map);
                }}
                class="bg-slate-700"
              >
              Open Source document / event
              </button>

              <Resizer width height rotation />
            </section>

            <Anchor direction="west" dynamic />
            <Anchor direction="west" dynamic />
          </div>
        </Node>
      {/each}
  </Svelvet>

  {#if nodes.length < 1}
    <p>No events selected. Please open an event and click, "Add to list"</p>
  {:else}
    <button
      on:click={() =>
        highlightAllFeatures(highlightLayer, map, $selectedFeatures)}
      class="bg-slate-700"
    >
      Highlight all events
    </button>

    <button
      on:click={() => {
        selectedFeatures.set([]);
        highlightLayer.clearLayers();
        nodes = [];
      }}
      class="bg-slate-700"
    >
      Clear all events
    </button>
  {/if}
</div>

<style>
  :global(.dropzone) {
    border: 1px solid #ccc;
    border-radius: 5px;
    max-width: 80%;
    padding: 0.2em !important;
    margin-right: 0.5em !important;
  }
  button {
    margin-top: 0.2em;
    size: 1em;
    padding: 0.2em 0.5em;
  }

  #background-wrapper {
    background-color: #faebd7;
  }

  .node {
    width: 100%;
    height: 100%;
    background-color: #faebd7;
    border-radius: 8px;
    border: 2px solid black;
    padding: 0.6em;
  }
  .selected {
    border: 2px solid white;
  }
  ul {
    list-style-type: none;
    padding: 1em;
  }
</style>
