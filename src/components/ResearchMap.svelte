<script>
  import { markupNodes, uploadedSources, narrativeNodes } from "../stores.js";

  import { Background, Svelvet, Node } from "svelvet";

  import MarkupNode from "./nodes/MarkupNode.svelte";
  import DataSourceNode from "./nodes/DataSourceNode.svelte";
  import NarrativeNode from "./nodes/NarrativeNode.svelte";

  import ShareModal from "./ShareModal.svelte";

  export let supabase;

  let width, height;
</script>

<section id="research-map" bind:clientHeight={height} bind:clientWidth={width}>
  <Svelvet edgeStyle="step" TD {height} {width} zoom={0.6}>
    <Background bgColor="#faebd7" slot="background" />
    {#each $markupNodes as markupNode (markupNode.id)}
      <MarkupNode {markupNode} />
    {/each}
    {#each $uploadedSources as source (source.name)}
      <DataSourceNode sourceNode={source} />
    {/each}
    {#each $narrativeNodes as narrativeNode (narrativeNode.id)}
      <NarrativeNode node={narrativeNode} />
    {/each}
  </Svelvet>

  {#if $narrativeNodes.length < 1 && $uploadedSources.length >= 1 && $markupNodes.length >= 1}
    <button
      id="startNarrativeMaking"
      on:click={() => {
        // For narrative nodes
        // start with blank
        $narrativeNodes.push({
          id: "narrativeNode-" + 1,
          label: "Provide a title for the data story",
          notes: "Enter body text",
          position: { x: 600, y: -100 },
          files: {
            accepted: [],
            rejected: [],
          },
        });

        $narrativeNodes = $narrativeNodes;
      }}
    >
      Start making a narrative
    </button>
  {/if}
</section>

<section id="research-map-menu">
  <button class="bg-slate-800"> Highlight all events </button>

  <button
    on:click={() => {
      markupNodes.set([]);
      uploadedSources.set([]);
      narrativeNodes.set([]);
    }}
    class="bg-slate-800"
  >
    Clear all data
  </button>
  <ShareModal {supabase} />
</section>

<style>
  #research-map {
    height: 80%;
    width: 100%;
  }

  #startNarrativeMaking {
    position: absolute;
    top: 0;
    right: 0;
    margin: 1em;
    background-color: rgb(41, 123, 123);
    z-index: 100;
  }
</style>
