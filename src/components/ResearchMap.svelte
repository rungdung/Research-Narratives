<script>
  import { map } from "./Map.svelte";
  import { selectedFeatures } from "../stores.js";
  import { onMount } from "svelte";

  import {
    highlightAllFeatures,
    zoomToFeature,
  } from "../utils/mapMovements.mjs";

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
    console.log("clearing");
    $selectedFeatures = [];
    nodes = [];
    nodes = nodes;
  });

  $: if ($selectedFeatures.length > 0) {
    lastValue = $selectedFeatures[$selectedFeatures.length - 1];
    nodes.push({
      label:
        lastValue.title ||
        lastValue.name ||
        lastValue.id ||
        "No title field available",
      notes: "",
      feature: lastValue.feature,
      source: lastValue.feature.layer.source,
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

<section id="research-map">
  {#if nodes.length < 1}
    <p>No events selected. Please open an event and click, "Add to list"</p>
  {:else}
    <Svelvet id={"mindmap-canvas"} fitView={'resize'} controls minimap zoom={0.6}>
      <Background bgColor="#faebd7" slot="background" />
      {#each nodes as node}
        <Node  {...node} useDefaults   >
          <div class="node">
            <section class="node-contents container mx-3 my-3">
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
                  nodes = nodes;
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

            <Anchor direction="west" multiple/>
            <Anchor direction="east" multiple />
          </div>
        </Node>
      {/each}
    </Svelvet>

    <section id="research-map-menu">
      <button class="bg-slate-800"> Highlight all events </button>

      <button
        on:click={() => {
          selectedFeatures.set([]);
          nodes = [];
        }}
        class="bg-slate-800"
      >
        Clear all events
      </button>

      <button
        on:click={() => {
          console.log("Testing rendering");
        }}
        class="bg-slate-800"
      >
        Render data as a story
      </button>

      <button
        on:click={() => {
          console.log("Testing rendering");
        }}
        class="bg-slate-800"
      >
        Share research map
      </button>
    </section>
  {/if}
  </section>

<style>
  :global(#research-map) {
height: 80%;
width: 100vw;
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
  .node-contents {
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

  #background-wrapper {
    background-color: #faebd7;
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
  .selected {
    border: 2px solid white;
  }
  ul {
    list-style-type: none;
    padding: 1em;
  }
</style>
