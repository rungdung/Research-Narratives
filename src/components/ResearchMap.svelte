<script>
  import { markupNodes, uploadedSources, narrativeNodes } from "../stores.js";
  import { onMount } from "svelte";

  import { Background, Svelvet, Node } from "svelvet";

  import MarkupNode from "./nodes/MarkupNode.svelte";
  import DataSourceNode from "./nodes/DataSourceNode.svelte";
  import NarrativeNode from "./nodes/NarrativeNode.svelte";

  import ShareModal from "./ShareModal.svelte";

  export let supabase;

  export let width, height;

  // For narrative nodes
  // start with blank
  if ($narrativeNodes.length < 1) {
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
  }
</script>

<Svelvet edgeStyle="step" TD height={600} {width} zoom={0.6}>
  <Background bgColor="#faebd7" slot="background" />
  {#each $markupNodes as markupNode (markupNode.id)}
    <MarkupNode {markupNode} />
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
      markupNodes.set([]);
    }}
    class="bg-slate-800"
  >
    Clear all events
  </button>
  <ShareModal {supabase} />
</section>
