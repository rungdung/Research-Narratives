<script>
  import { Node, Anchor, generateOutput, generateInput } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import { DataHandler, Datatable, Th, ThFilter } from "@vincjo/datatables"; //https://vincjo.fr/datatables/
  import { CollapsibleCard } from "svelte-collapsible";

  export let markupNode;

  import { map } from "../Map.svelte";

  import { zoomToFeature } from "../../utils/mapMovements.mjs";

  import { markupNodes } from "../../stores";

  import CustomAnchor from "./customAnchor.svelte";
  import AnimatedEdge from "./customAnimatedEdge.svelte";

  let categories = [
    { text: "Category 1", value: "1" },
    { text: "Category 2", value: "2" },
    { text: "Category 3", value: "3" },
  ];

  let position;

  // map the data to key value pairs for the table
  let data = Object.entries(markupNode.properties).map(([key, value]) => {
    return {
      key: key,
      value: value,
    };
  });
  // Create a new data handler for the table
  const handler = new DataHandler(data, { rowsPerPage: 5 });
  const rows = handler.getRows();

  //File uploads
  function handleFilesSelect(e, files) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
  }

  // Data transfer
  let inputs = generateInput({
    mapFeature: markupNode.feature,
  });
  const processor = ($inputs) => {
    console.log($inputs.mapFeature);
    return $inputs;
  };
  const output = generateOutput(inputs, processor);

  function updatePosition() {
    markupNodes.update((nodes) => {
      let index = nodes.findIndex((node) => node.id == markupNode.id);
      nodes[index].position = position;
      return nodes;
    });
  }
</script>

<Node
  {...markupNode}
  id={markupNode.id}
  let:grabHandle
  bind:position
  on:nodeClicked={updatePosition}
>
  <div class="node" use:grabHandle>
    <section class="node-wrapper container mx-3 my-3">
      <h2 class="text-2xl text-white whitespace-normal">
        {markupNode.label}
      </h2>
      <textarea
        class="text-white body my-1 py-1"
        value={markupNode.notes}
        placeholder="Enter notes"
      />

      <Dropzone
        on:drop={(e) => {
          handleFilesSelect(e, markupNode.files);
          markupNode = markupNode;
        }}
        accept="image/*"
        containerClasses="dropzoneChart"
      />

      {#each markupNode.files.accepted as item}
        <img src={URL.createObjectURL(item)} alt="preview" />
      {/each}
      <CollapsibleCard open={false}>
        <span
          slot="header"
          class="text-gray-50 bg-slate-600 p-2 w-max rounded-md"
          >Table of properties</span
        >
        <section slot="body">
          <Datatable {handler} class="text-gray-300">
            <table>
              <thead>
                <Th {handler} orderBy="key">Key</Th>
                <Th {handler} orderBy="value">Value</Th>
              </thead>
              <tbody>
                {#each $rows as row}
                  <tr>
                    <td>{@html row.key}</td>
                    <td>{@html row.value}</td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </Datatable>
        </section>
      </CollapsibleCard>
      <button
        on:click={() => {
          zoomToFeature(markupNode.feature, map);
        }}
        class="bg-slate-800"
      >
        Open Source document / event
      </button>
    </section>
    <span class="anchor-top">
      <Anchor
        edge={AnimatedEdge}
        let:linked
        let:connecting
        let:hovering
        multiple={false}
        direction="north"
        connections={[markupNode.source]}
      >
        <CustomAnchor {hovering} {connecting} {linked} />
      </Anchor>
    </span>
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
        key="mapFeature"
        output
      >
        <CustomAnchor {hovering} {connecting} {linked} label="Data" />
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
    width: 90%;
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
