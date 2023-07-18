<script>
  import { Node, Anchor, generateInput, generateOutput } from "svelvet";
  import { narrativeNodes } from "../../stores";
  import { Textarea, Label } from "flowbite-svelte";
  import CustomAnchor from "./customAnchor.svelte";
  import { addNewNarrativeNode } from "../../utils/addNewNodes.mjs";

  export let node;

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
    } catch (error) {
      console.log(error);
    }
    return node;
  };

  const output = generateOutput(inputs, processor);
</script>

<Node id={node.id} {...node}>
  <div class="node pb-3 px-1" let:grabHandle>
    <div class="node-wrapper">
      <h2 class="text-2xl my-3 text-black whitespace-normal">
        Narrative Section
      </h2>
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
      <Label for="section-title" class="mb-0 !text-blac"
        >Provide a title for the section</Label
      >
      <Textarea
        class="text-black body my-1 py-1 w-full rounded-md bg-inputField-100"
        bind:value={node.label}
        rows="2"
        name="section-title"
      />
      <Label for="section-content" class="mb-0 !text-black "
        >Section content</Label
      >
      <Textarea
        class="text-black body my-1 py-1 w-full rounded-md bg-inputField-100"
        bind:value={node.notes}
        rows="4"
        name="section-content"
      />
    </div>
    <section id="inputs" class="space-y-1">
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
    </section>
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
  #inputs {
    transform: translate(-8%, 0);
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
    width: 100%;
    height: 100%;
    min-width: 3em;
    max-width: 25em;
    background-color: #d2e8e3;
    border-radius: 8px;
    border: 3px solid black;
  }
</style>
