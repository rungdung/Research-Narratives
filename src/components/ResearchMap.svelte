<script>
  import {
    markupNodes,
    uploadedSources,
    narrativeNodes,
    annotationNodes,
  } from "../stores.js";

  import { Background, Svelvet, Node, Group } from "svelvet";

  import MarkupNode from "./nodes/MarkupNode.svelte";
  import DataSourceNode from "./nodes/DataSourceNode.svelte";
  import NarrativeNode from "./nodes/NarrativeNode.svelte";
  import AnnotationNode from "./nodes/AnnotationNode.svelte";

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

    {#each $annotationNodes as annotationNode (annotationNode.id)}
      <AnnotationNode {annotationNode} />
    {/each}
  </Svelvet>

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

  <button
    id="createAnnotations"
    on:click={() => {
      // for empty markupnodes
      $annotationNodes.push({
        id:
          $annotationNodes.length > 0
            ? "annotationNode-" + ($annotationNodes.length + 1)
            : "annotationNode-" + 1,
        label: "Caption for the image",
        notes: "Annotation text",
        position: { x: 600, y: -100 },
        files: {
          accepted: [],
          rejected: [],
        },
        images: [],
        charts: [],
      });
      $annotationNodes = $annotationNodes;
    }}
  >
    Insert media
  </button>
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

  #startNarrativeMaking,
  #createAnnotations {
    position: absolute;
    top: 0;
    right: 0;
    margin: 1em;
    background-color: rgb(41, 123, 123);
    z-index: 100;
  }

  #createAnnotations {
    top: 3em !important;
  }
</style>
