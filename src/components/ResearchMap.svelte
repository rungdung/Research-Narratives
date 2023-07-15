<script>
  import {
    markupNodes,
    uploadedSources,
    narrativeNodes,
    annotationNodes,
    connections,
  } from "../stores.js";

  import { Background, Svelvet, Node, Group } from "svelvet";

  import MarkupNode from "./nodes/MarkupNode.svelte";
  import NarrativeNode from "./nodes/NarrativeNode.svelte";
  import AnnotationNode from "./nodes/AnnotationNode.svelte";

  import ShareModal from "./ShareModal.svelte";
  import { Button, SpeedDial, SpeedDialButton } from "flowbite-svelte";
  import {
    CloseCircleSolid,
    PenNibSolid,
    DownloadSolid,
  } from "flowbite-svelte-icons";
  import {
    addNewNarrativeNode,
    addNewAnnotationNode,
  } from "../utils/addNewNodes.mjs";

  import { onMount } from "svelte";
  export let supabase;
  let nodesCopy = [];

  let width, height;

  async function handleConnection(e) {
    let sourceNodeId =
      e.detail.sourceNode.id.split("-")[1] +
      "-" +
      e.detail.sourceNode.id.split("-")[2];
    let sourceAnchorId = e.detail.sourceAnchor.id
      .replace("A-", "")
      .split("/")[0];
    let targetNodeId =
      e.detail.targetNode.id.split("-")[1] +
      "-" +
      e.detail.targetNode.id.split("-")[2];
    let targetAnchorId = e.detail.targetAnchor.id
      .replace("A-", "")
      .split("/")[0];

    // For Sets to deep compare objects, they need to be stringified
    $connections.add(
      JSON.stringify({
        sourceNodeId,
        sourceAnchorId,
        targetNodeId,
        targetAnchorId,
      })
    );
  }

  async function saveConnections() {
    // go through markup nodes, search for sourceId and append to conenctions
    nodesCopy = $markupNodes;
    try {
      // https://stackoverflow.com/a/51537887
      $connections.forEach((connection) => {
        connection = JSON.parse(connection);
        let index = $markupNodes.findIndex(
          (node) => node.id == connection.sourceNodeId
        );

        let connectionToPush = [
          connection.targetNodeId,
          connection.targetAnchorId,
        ];

        if (index >= 0 && connection.sourceAnchorId == "data") {
          nodesCopy[index].dataConnections.push(connectionToPush);
        } else if (index >= 0) {
          nodesCopy[index].connections.push(connectionToPush);
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  onMount(() => {
    if (nodesCopy.length > 0) {
      markupNodes.set(nodesCopy);
    }
    console.log($markupNodes);
  });
</script>

<section id="research-map" bind:clientHeight={height} bind:clientWidth={width}>
  <Svelvet
    edgeStyle="bezier"
    raiseEdgesOnSelect
    {height}
    {width}
    zoom={0.6}
    on:connection={handleConnection}
  >
    <Background bgColor="#faebd7" slot="background" />
    {#each $markupNodes as markupNode (markupNode.id)}
      <MarkupNode {markupNode} />
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
  <Button color="dark" on:click={saveConnections}
    ><DownloadSolid svgClass="dark mx-1" />
    Save changes locally
  </Button>
  <ShareModal {supabase} />
</section>

<style>
  #research-map {
    height: 80%;
    width: 100%;
  }
</style>
