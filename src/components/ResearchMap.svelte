<script>
  import { map } from "./Map.svelte";
  import {
    selectedFeatures,
    uploadedSources,
    narrativeNodes,
  } from "../stores.js";
  import { onMount } from "svelte";

  import { Background, Svelvet, Group } from "svelvet";

  import MarkupNode from "./nodes/MarkupNode.svelte";
  import DataSourceNode from "./nodes/DataSourceNode.svelte";
  import NarrativeNode from "./nodes/NarrativeNode.svelte";

  export let height;

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

  $narrativeNodes.push({
    id: "NarrativeNode-1",
    label: "Narrative",
    notes: "Enter narrative text",
    position: { x: 300, y: -100 },
    files: {
      accepted: [],
      rejected: [],
    },
  });
</script>

<section id="research-map">
  {#if $selectedFeatures.length > 0 || $uploadedSources.length > 0}
    <Svelvet id={"mindmap-canvas"} fitView={"resize"} zoom={0.6}>
      <Background bgColor="#faebd7" slot="background" />
      {#if $selectedFeatures.length > 0}
        {#each nodes as node}
          <MarkupNode {node} />
        {/each}
      {/if}
      {#if $uploadedSources.length > 0}
        <Group
          position={{ x: -150, y: -100 }}
          width={400}
          height={700}
          color="goldenrod"
          groupName="Sources"
        >
          {#each $uploadedSources as source}
            <DataSourceNode node={source} />
          {/each}
        </Group>
      {/if}
      {#each $narrativeNodes as narrativeNode}
        <NarrativeNode node={narrativeNode} />
      {/each}
    </Svelvet>
  {/if}
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

<style>
  :global(#research-map) {
    height: 80%;
    width: 100vw;
  }
</style>
