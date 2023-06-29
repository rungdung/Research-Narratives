<script>
  import { Node, Anchor } from "svelvet";
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import { narrativeNodes } from "../../stores";
  import CustomAnchor from "./customAnchor.svelte";

  export let node;
  let previousNode, addNewButton;
  function handleFilesSelect(e, files) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
  }

  function addNewBelow() {
    // add a new narrative node
    addNewButton.style.display = "none";
    previousNode = $narrativeNodes[$narrativeNodes.length - 1];
    $narrativeNodes.push({
      id: previousNode.id.split("-")[0] + "-" + ($narrativeNodes.length + 1),
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
      connections: [previousNode.id],
    });
    $narrativeNodes = $narrativeNodes;
  }
</script>

<Node id={node.id} {...node}>
  <div class="node" let:grabHandle>
    <div class="node-wrapper">
      <span class="anchor-top">
        <Anchor let:linked let:connecting let:hovering multiple={false}>
          <CustomAnchor {hovering} {connecting} {linked} />
        </Anchor>
      </span>
      <textarea
        class="text-white title bg-slate my-1 py-1 w-100"
        bind:value={node.label}
        placeholder="Enter title markup"
      />
      <textarea
        class="text-white body my-1 py-1"
        bind:value={node.notes}
        placeholder="Enter body text"
      />
    </div>
    <section id="inputs">
      <span class="">
        <Anchor let:linked let:connecting let:hovering multiple={false} input>
          <CustomAnchor {hovering} {connecting} {linked}>Images</CustomAnchor>
        </Anchor>
      </span>
      <span class="">
        <Anchor let:linked let:connecting let:hovering multiple={false} input>
          <CustomAnchor {hovering} {connecting} {linked} />
        </Anchor>
      </span>
      <span class="">
        <Anchor let:linked let:connecting let:hovering multiple={false} input>
          <CustomAnchor {hovering} {connecting} {linked} />
        </Anchor>
      </span>
    </section>
    <span class="add-node-below">
      <button
        class="rounded-md text-2xl mx-auto"
        bind:this={addNewButton}
        on:click={() => {
          addNewBelow();
        }}
      >
        +
      </button>
    </span>
    <span class="anchor">
      <Anchor let:linked let:connecting let:hovering multiple={false}>
        <CustomAnchor {hovering} {connecting} {linked} />
      </Anchor>
    </span>
  </div>
</Node>

<style>
  .anchor,
  .anchor-top {
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
</style>
