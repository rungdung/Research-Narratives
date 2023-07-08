<script>
  import { Node, Anchor, generateOutput, generateInput } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import { DataHandler, Datatable, Th, ThFilter } from "@vincjo/datatables"; //https://vincjo.fr/datatables/
  import { Accordion, AccordionItem } from "flowbite-svelte";
  import { loadToDB } from "../../utils/loadToDB.mjs";
  import { annotationNodes } from "../../stores";
  import CustomAnchor from "./customAnchor.svelte";

  export let annotationNode;
  let position;

  // // map the data to key value pairs for the table
  // let data = Object.entries(annotationNode.properties).map(([key, value]) => {
  //   return {
  //     key: key,
  //     value: value,
  //   };
  // });
  // // Create a new data handler for the table
  // const handler = new DataHandler(data, { rowsPerPage: 5 });
  // const rows = handler.getRows();

  //File uploads
  async function handleFilesSelect(e, files) {
    let { acceptedFiles, fileRejections } = e.detail;
    acceptedFiles = await loadToDB(acceptedFiles[0], acceptedFiles[0].name);
    files.accepted = [...files.accepted, acceptedFiles];
    files.rejected = [...files.rejected, fileRejections];
  }

  // Data transfer
  let inputs = generateInput({
    images: annotationNode.files,
  });
  const processor = ($inputs) => {
    console.log($inputs);
    console.log($inputs.images);
    return $inputs;
  };
  const output = generateOutput(inputs, processor);

  function updatePosition() {
    annotationNodes.update((nodes) => {
      let index = nodes.findIndex((node) => node.id == annotationNode.id);
      nodes[index].position = position;
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
            class="text-white body my-1 py-1"
            value={annotationNode.label}
          />
          <textarea
            class="text-white body my-1 py-1"
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
        containerClasses="dropzoneChart !bg-gray-600 text-white border-2 border-b-zinc-700"
      />
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
        let:linked
        let:connecting
        let:hovering
        outputStore={output}
        key="images"
        output
      >
        <CustomAnchor {hovering} {connecting} {linked} label="Images" />
      </Anchor>
    </span>
  </div>
</Node>

<style>
  .card-header {
    width: 100% !important;
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
  textarea,
  :global(select) {
    background-color: #475569;
    border: 1px solid #ccc;
    border-radius: 5px;
    color: white;

    padding: 0.2em !important;
    margin-right: 0.5em !important;
  }
  .title,
  .body {
    width: 100%;
    height: fit-content;
  }
  .title {
    height: 3em;
    font-size: larger;
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
