<script>
  import { markupNodes, uploadedSources, narrativeNodes } from "../stores.js";

  import { Background, Svelvet, Node, Group } from "svelvet";

  import MarkupNode from "./nodes/MarkupNode.svelte";
  import DataSourceNode from "./nodes/DataSourceNode.svelte";
  import NarrativeNode from "./nodes/NarrativeNode.svelte";

  import ShareModal from "./ShareModal.svelte";
  import { Button } from "flowbite-svelte";
  import { CloseCircleSolid } from "flowbite-svelte-icons";
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
          mapFeature: null,
          images: [],
          charts: [],
        });

        $narrativeNodes = $narrativeNodes;
      }}
    >
      Start making a narrative
    </button>
  {/if}
</section>

<section id="research-map-menu" class="text-center">
  <Button
    color="dark"
    outline
    on:click={() => {
      markupNodes.set([]);
      narrativeNodes.set([]);
    }}
  >
    <CloseCircleSolid svgClass="dark mx-1" />
    Clear all data
  </Button>
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
