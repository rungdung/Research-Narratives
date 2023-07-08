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
  import { Button, SpeedDial, Listgroup, ListgroupItem } from "flowbite-svelte";
  import { CloseCircleSolid, PlusSolid } from "flowbite-svelte-icons";
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

  <SpeedDial color="dark" class="absolute top-0 right-0" placement="bottom">
    <Listgroup active class="w-100">
      <ListgroupItem
        name="Add new section for the data story"
        on:click={addNewNarrativeNode}
        class="w-40"
        ><PlusSolid class="mr-2 w-5 h-5" size="20" />Add new section for the
        data story</ListgroupItem
  >
      <ListgroupItem
        name="Add new annotation node"
        on:click={addNewAnnotationNode}
        class="w-40"
        ><PlusSolid class="mr-2 w-5 h-5" size="20" />
        Add new media
      </ListgroupItem>
    </Listgroup>
  </SpeedDial>
</section>

<section id="research-map-menu" class="text-center">
  <Button
    color="dark"
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
