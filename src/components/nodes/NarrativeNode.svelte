<script>
  import { Node, Anchor, generateInput, generateOutput } from "svelvet";
  import { narrativeNodes } from "../../stores";
  import { Textarea, Label, Button } from "flowbite-svelte";
  import CustomAnchor from "./customAnchor.svelte";
  import { addNewNarrativeNode } from "../../utils/addNewNodes.mjs";

  export let node;

  // If data is spatial or image, grey out the input
  let mapDataConnected = false,
    imageDataConnected = false,
    mapDataLinked = false,
    imageDataLinked = false;

  const inputs = generateInput({});

  const processor = ($inputs) => {
    try {
      node.narrativeData = $inputs.narrativeData;
      // insert into parent store
      narrativeNodes.update((pNodes) => {
        let index = pNodes.findIndex((parentNode) => parentNode.id == node.id);
        pNodes[index] = node;
        return pNodes;
      });

      if ("mapFeature" in $inputs.narrativeData) {
        mapDataConnected = true;
      } else if ("images" in $inputs.narrativeData) {
        imageDataConnected = true;
      }
    } catch (error) {
      console.log(error);
    }
    return node;
  };

  const output = generateOutput(inputs, processor);

  function deleteNode() {
    narrativeNodes.update((nodes) => {
      let index = nodes.findIndex((node_) => node_.id == node.id);
      nodes.splice(index, 1);
      return nodes;
    });
  }
</script>

<Node id={node.id} {...node}>
  {#if node.id != "narrativeNode-0"}
    <div class="node-wrapper">
      <h2 class="text-2xl my-3 text-black whitespace-normal">
        {node.label}
      </h2>

      {#if node.id.split("-")[1] == $narrativeNodes.length - 1}
        <section id="meta-menu" class="mt-3 absolute right-0 top-5">
          <Button
            size="xs"
            class="px-1 py-0 m-0 rounded-sm"
            on:click={() => {
              deleteNode();
            }}>x</Button
          >
        </section>
      {/if}

      <Label for="section-title" class="mb-0 !text-blac"
        >Provide a title for the section</Label
      >
      <Textarea
        class="text-black body my-1 py-1 w-full rounded-md bg-inputField-100"
        bind:value={node.label}
        rows="2"
        name="section-title"
      />
      <Label for="section-content" class="mb-0 !text-black ">Abstract</Label>
      <Textarea
        class="text-black body my-1 py-1 w-full rounded-md bg-inputField-100"
        bind:value={node.notes}
        rows="4"
        name="section-content"
      />
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
      <span class="anchor">
        <Anchor
          let:linked
          let:connecting
          let:hovering
          multiple={false}
          id={node.id.concat("2")}
          direction="north"
        >
          <CustomAnchor {hovering} {connecting} {linked} />
        </Anchor>
        {#if node.id.split("-")[1] == $narrativeNodes.length - 1}
          <span class="add-node-below">
            <button
              class="rounded-md text-2xl mx-auto"
              on:click={() => {
                addNewNarrativeNode();
              }}
            >
              +
            </button>
          </span>
        {/if}
      </span>
      <section id="inputs" class="space-y-2 my-4">
        <div class:hidden={imageDataConnected}>
        <Anchor
          let:linked
          let:connecting
          let:hovering
          multiple={false}
          inputsStore={inputs}
          input
          key="narrativeData"
        >
          <CustomAnchor
            {hovering}
            {connecting}
            {linked}
            label="Spatial Feature"
          />
        </Anchor>
        </div>
        <div class:hidden={mapDataConnected}>
        <Anchor
          let:linked
          let:connecting
          let:hovering
          multiple={false}
          inputsStore={inputs}
          input
          key="narrativeData"
        >
          <CustomAnchor {hovering} {connecting} {linked} label="Images" />
        </Anchor>
        </div>
      </section>
    </div>
  {:else if node.id == "narrativeNode-0"}
    <div class="node-wrapper node-1">
      <h2 class="text-3xl my-3 text-black whitespace-normal">
        {node.label}
      </h2>
      <Textarea
        class="text-black body my-1 py-1 w-full rounded-md bg-inputField-100"
        bind:value={node.label}
        rows="2"
        name="section-title"
      />
      <Label for="section-content" class="mb-0 !text-black ">Abstract</Label>
      <Textarea
        class="text-black body my-1 py-1 w-full rounded-md bg-inputField-100"
        bind:value={node.notes}
        rows="4"
        name="section-content"
      />

      <span class="anchor">
        <Anchor
          let:linked
          let:connecting
          let:hovering
          multiple={false}
          id={node.id.concat("2")}
          direction="north"
        >
          <CustomAnchor {hovering} {connecting} {linked} />
        </Anchor>
        {#if node.id.split("-")[1] == $narrativeNodes.length - 1}
          <span class="add-node-below">
            <button
              class="rounded-md text-2xl mx-auto"
              on:click={() => {
                addNewNarrativeNode();
              }}
            >
              +
            </button>
          </span>
        {/if}
      </span>
    </div>
  {/if}
</Node>

<style>
  .node-1 {
    margin-top: 2em;
    border: 5px black double;
    background-color: #b2d1c9 !important;
    width: 130% !important;
    max-width: 35em !important;
  }

  .node-wrapper {
    width: 100%;
    height: 100%;
    min-width: 3em;
    max-width: 25em;
    padding: 0em 1em 1em 1em;
    background-color: #d2e8e3;
    border-radius: 8px;
    border: 3px solid black;
  }
  #inputs {
    transform: translate(-13%, 0);
  }
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

  .node-wrapper {
    margin: 1em;
    min-width: 20em;
  }

  button {
    margin-top: 0.2em;
    size: 1em;
    padding: 0.2em 0.5em;
  }

  .node {
  }
</style>
