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
  import { Button, SpeedDial, SpeedDialButton } from "flowbite-svelte";
  import { CloseCircleSolid, PenNibSolid } from "flowbite-svelte-icons";
  import {
    addNewNarrativeNode,
    addNewAnnotationNode,
  } from "../utils/addNewNodes.mjs";
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

  <SpeedDial
    color="dark"
    class="absolute bottom-0 left-2 "
    placement="top"
    tooltip="none"
    popperDefaultClass="flex items-left gap-2"
  >
    <PenNibSolid
      slot="icon"
      fill="currentColor"
      class="w-8 h-8"
      viewBox="0 0 20 20"
      svgClass="text-white"
      size="10"
    />
    <SpeedDialButton
      name="Add new section for the data story"
      on:click={addNewNarrativeNode}
      class="ml-3 w-40"
    />
    <SpeedDialButton
      on:click={addNewAnnotationNode}
      class="ml-3 w-40"
      name="Add new media"
    />
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
</style>
