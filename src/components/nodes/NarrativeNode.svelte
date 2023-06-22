<script>
  import { Node, Anchor } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import { narrativeNodes } from "../../stores";
  export let node;
  let previousNode;
  function handleFilesSelect(e, files) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
  }
</script>

<Node id={node.id} {...node} useDefaults>
  <div class="node" let:grabHandle>
    <div class="node-wrapper">
      <textarea
        class="text-white title bg-slate my-1 py-1 w-100"
        value={node.label}
        placeholder="Enter title markup"
      />
      <textarea
        class="text-white body my-1 py-1"
        value={node.notes}
        placeholder="Enter body text"
      />
      <Dropzone
        on:drop={(e) => {
          handleFilesSelect(e, node.files);
          node = node;
        }}
        accept="image/*"
        containerClasses="dropzoneChart"
      />
      {#each node.files.accepted as item}
        <img src={URL.createObjectURL(item)} alt="preview" />
      {/each}
    </div>
    <span class="add-node-below">
      <button
        class="rounded-md text-2xl mx-auto"
        on:click={() => {
          // add a new narrative node
          previousNode = $narrativeNodes[$narrativeNodes.length - 1];
          $narrativeNodes.push({
            id: "NarrativeNode-" + ($narrativeNodes.length + 1),
            label: "Narrative",
            notes: "Enter narrative text",
            position: {
              x: previousNode.position.x,
              y: previousNode.position.y + 300,
            },
            files: {
              accepted: [],
              rejected: [],
            },
          });
          $narrativeNodes = $narrativeNodes;
        }}
      >
        +
      </button>
    </span>
    <Anchor direction="west" />
  </div>
</Node>

<style>
  .add-node-below {
    margin: auto;
  }
  textarea,
  :global(select) {
    background-color: #475569;
    border: 1px solid #ccc;
    border-radius: 5px;
    max-width: 80%;
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
  }
  :global(.dropzone) {
    border: 1px solid #ccc;
    border-radius: 5px;
    max-width: 80%;
    padding: 0.2em !important;
    margin-right: 0.5em !important;
  }

  :global(.dropzoneChart) {
    max-width: 90%;
  }
  button {
    margin-top: 0.2em;
    size: 1em;
    padding: 0.2em 0.5em;
  }

  .node {
    width: 100%;
    height: 100%;
    min-width: 3em;
    max-width: 25em;
    background-color: #ebcfab;
    border-radius: 8px;
    border: 3px solid black;
  }
  .selected {
    border: 2px solid white;
  }
  ul {
    list-style-type: none;
    padding: 1em;
  }
</style>
