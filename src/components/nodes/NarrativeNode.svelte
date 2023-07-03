<script>
  import { Node, Anchor, generateInput, generateOutput } from "svelvet";
  import { narrativeNodes } from "../../stores";
  import CustomAnchor from "./customAnchor.svelte";

  export let node;
  let previousNode, addNewButton;

  function addNewBelow() {
    // add a new narrative node
    addNewButton.style.display = "none";
    previousNode = $narrativeNodes[$narrativeNodes.length - 1];
    let previousId = previousNode.id;
    let id = previousNode.id.split("-")[0] + "-" + ($narrativeNodes.length + 1);
    $narrativeNodes.push({
      id: id,
      label: "Section Heading",
      notes: "Enter narrative text to accompany the section",
      position: {
        x: previousNode.position.x,
        y: previousNode.position.y + 300,
      },
      files: {
        accepted: [],
        rejected: [],
      },
      connections: [
        [id, id.concat("1")],
        [previousId, previousId.concat("2")],
      ],
      mapFeature: null,
      images: [],
      charts: [],
    });
    $narrativeNodes = $narrativeNodes;
  }

  const inputs = generateInput({
    mapFeature: null,
    images: [],
    charts: [],
  });

  const processor = ($inputs) => {
    try {
      node.mapFeature = $inputs["mapFeature"];
      console.log(node.mapFeature);
      node.images.push(...$inputs["images"]);
      node.charts.push(...$inputs["charts"]);

      // insert into parent store
      // find index in store
      narrativeNodes.update((pNodes) => {
        let index = pNodes.findIndex((parentNode) => parentNode.id == node.id);
        pNodes[index] = node;
        return pNodes;
      });
    } catch (error) {
      console.log(error);
    }
    return node;
  };

  const output = generateOutput(inputs, processor);
</script>

<Node id={node.id} {...node}>
  <div class="node" let:grabHandle>
    <div class="node-wrapper">
      {#if node.id != "narrativeNode-1"}
        <span class="anchor-top">
          <Anchor
            let:linked
            let:connecting
            let:hovering
            multiple={false}
            direction="south"
            id={node.id.concat("1")}
          >
            <CustomAnchor {hovering} {connecting} {linked} />
          </Anchor>
        </span>
      {/if}
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
        <Anchor
          let:linked
          let:connecting
          let:hovering
          multiple={false}
          inputsStore={inputs}
          input
          key="mapFeature"
        >
          <CustomAnchor
            {hovering}
            {connecting}
            {linked}
            label="Spatial Feature"
          />
        </Anchor>
      </span>
      <span class="">
        <Anchor
          let:linked
          let:connecting
          let:hovering
          multiple={false}
          inputsStore={inputs}
          input
          key="images"
        >
          <CustomAnchor {hovering} {connecting} {linked} label="Images" />
        </Anchor>
      </span>
      <span class="">
        <Anchor
          let:linked
          let:connecting
          let:hovering
          multiple={false}
          inputsStore={inputs}
          input
          key="charts"
        >
          <CustomAnchor {hovering} {connecting} {linked} label="Charts" />
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
      <Anchor
        let:linked
        let:connecting
        let:hovering
        multiple={false}
        id={node.id.concat("2")}
        direction="north"
      >
        <CustomAnchor {hovering} {connecting} {linked} label="Next Section" />
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
    border-radius: 10px;
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
    background-color: #d2e8e3;
    border-radius: 8px;
    border: 3px solid black;
  }
</style>
