<script>
  import {
    selectedFeatures,
    uploadedSources,
    narrativeNodes,
  } from "../stores.js";
  import { onMount } from "svelte";

  import { Background, Svelvet, Node } from "svelvet";

  import MarkupNode from "./nodes/MarkupNode.svelte";
  import DataSourceNode from "./nodes/DataSourceNode.svelte";
  import NarrativeNode from "./nodes/NarrativeNode.svelte";

  export let nodes = [];
  let lastValue;

  // read from subscribed store
  // if reloading, load all from store
  // else load from local storage
  onMount(() => {
    console.log("clearing");
    $selectedFeatures = [];
    nodes = [];
    nodes = nodes;
  });

  // For markup nodes
  $: if ($selectedFeatures.length > 0) {
    lastValue = $selectedFeatures[$selectedFeatures.length - 1];
    nodes.push({
      id: lastValue.id,
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

  // For narrative nodes
  $narrativeNodes.push({
    id: "narrativeNode-" + 1,
    label: "Narrative",
    notes: "Enter narrative text",
    position: { x: 300, y: -100 },
    files: {
      accepted: [],
      rejected: [],
    },
  });

  // For data source nodes
</script>

<section id="research-map">
  <Svelvet
    edgeStyle="step"
    TD
    height={innerHeight - 200}
    width={innerWidth}
    zoom={0.6}
  >
    <Background bgColor="#faebd7" slot="background" />
    {#each nodes as node (node.id)}
      <MarkupNode {node} />
    {/each}
    {#each $uploadedSources as source (source.name)}
      <DataSourceNode node={source} />
    {/each}
    {#each $narrativeNodes as narrativeNode (narrativeNode.id)}
      <NarrativeNode node={narrativeNode} />
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
</section>
