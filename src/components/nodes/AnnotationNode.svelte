<script>
  import { Node, Anchor, generateOutput, generateInput } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import { DataHandler, Datatable, Th, ThFilter } from "@vincjo/datatables"; //https://vincjo.fr/datatables/
  import { Accordion, AccordionItem, Button } from "flowbite-svelte";
  import { loadToDB } from "../../utils/loadToDB.mjs";
  import { annotationNodes } from "../../stores";
  import CustomAnchor from "./customAnchor.svelte";
  import AnimatedEdge from "./customAnimatedEdge.svelte";
  export let annotationNode;
  let position;
  let inputs, processor, output;
  let nodeId = annotationNode.id.split("-")[1];
  // Deep copy to prevent Svelvet from overwriting data
  let dataConnectionsCopy = JSON.parse(
    JSON.stringify(annotationNode.dataConnections)
  );

  //File uploads
  async function handleFilesSelect(e, files) {
    let { acceptedFiles, fileRejections } = e.detail;
    acceptedFiles = await loadToDB(acceptedFiles[0], acceptedFiles[0].name);
    files.accepted = [...files.accepted, acceptedFiles];
    files.rejected = [...files.rejected, fileRejections];
    // sync with store
    annotationNodes.update((nodes) => {
      let index = nodes.findIndex((node) => node.id == annotationNode.id);
      nodes[index].files = files;
      return nodes;
    });
  }

  // Reactively update inputs
  $: if (annotationNode.files.accepted.length > 0) {
    // Data transfer
    inputs = generateInput({
      images: $annotationNodes[nodeId - 1].files.accepted,
    });

    processor = ($inputs) => {
      console.log("test");
      $inputs.images = annotationNode.files.accepted;
      return $inputs;
    };
    output = generateOutput(inputs, processor);
  }

  function updatePosition() {
    annotationNodes.update((nodes) => {
      let index = nodes.findIndex((node) => node.id == annotationNode.id);
      nodes[index].position = position;
      return nodes;
    });
  }

  function deleteNode() {
    annotationNodes.update((nodes) => {
      let index = nodes.findIndex((node) => node.id == annotationNode.id);
      nodes.splice(index, 1);
      return nodes;
    });
  }
</script>

<Node
  {...annotationNode}
  id={annotationNode.id}
  let:grabHandle
  bind:position
  on:nodeClicked={updatePosition}
>
  <div class="node" use:grabHandle>
    <section class="node-wrapper container mx-3 my-3">
      <h2 class="text-2xl text-white whitespace-normal">Uploaded Media</h2>

      <Accordion flush class="my-2 group-first:rounded-t-md">
        <AccordionItem paddingFlush={"p-2"}>
          <span slot="header" class="text-white"> Captions and Notes </span>
          <textarea
            class="text-gray-500 body my-1 py-1 w-full rounded-md bg-inputField-200"
            value={annotationNode.label}
          />
          <textarea
            class="text-gray-500 body my-1 py-1 w-full rounded-md bg-inputField-200"
            value={annotationNode.notes}
          />
        </AccordionItem>
      </Accordion>
      <Dropzone
        on:drop={(e) => {
          handleFilesSelect(e, annotationNode.files);
          annotationNode = annotationNode;
        }}
        accept="image/*"
        containerClasses="dropzoneChart !bg-gray-300 text-white border-2 border-b-zinc-700"
      />
      <section id="meta-menu" class="mx-3">
        <Button
          size="xs"
          class="px-1 py-0 m-0 rounded-sm"
          on:click={() => {
            deleteNode();
          }}>delete this</Button
        >
      </section>
      {#each annotationNode.files.accepted as item}
        <img src={item} alt="preview" />
      {/each}
    </section>

    <span class="anchor">
      <Anchor let:linked let:connecting let:hovering>
        <CustomAnchor {hovering} {connecting} {linked} />
      </Anchor>
    </span>
    <span class="anchor-right">
      <Anchor
        id="images"
        edge={AnimatedEdge}
        let:linked
        let:connecting
        let:hovering
        outputStore={output}
        key="narrativeData"
        connections={dataConnectionsCopy}
        output
      >
        <CustomAnchor
          {hovering}
          {connecting}
          {linked}
          label="Images"
          color="red-600"
        />
      </Anchor>
    </span>
  </div>
</Node>

<style>
  :global(.dropzoneChart) {
    background-color: #5e6b6a !important;
  }
  .anchor,
  .anchor-top,
  .anchor-right {
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .anchor {
    bottom: -10%;
    left: 50%;
  }

  .anchor-top {
    top: -10%;
    left: 50%;
  }
  .anchor-right {
    top: 50%;
    right: -5%;
  }

  .node-wrapper {
    margin: 1em;
    width: 90%;
  }

  .node {
    width: 100%;
    height: 100%;
    min-width: 3em;
    max-width: 25em;
    background-color: #5e6b6a;
    border-radius: 8px;
    border: 3px solid black;
  }
</style>
