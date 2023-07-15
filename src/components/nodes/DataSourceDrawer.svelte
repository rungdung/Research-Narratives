<script>
  import { uploadedSources } from "../../stores";
  import { DataHandler, Datatable, Th, ThFilter } from "@vincjo/datatables"; //https://vincjo.fr/datatables/
  import {
    Drawer,
    Button,
    CloseButton,
    Label,
    Input,
    Textarea,
  } from "flowbite-svelte";

  let handler, rows;
  export let sourceNode,
    hiddenBool = false;
  let position;

  // Attribute table
  // Create a new data handler for the table
  handler = new DataHandler(sourceNode.attributes, { rowsPerPage: 5 });
  rows = handler.getRows();

  // Insert spaceing into file names
  function insertSpaces(string) {
    string = string.replace(/([a-z])([A-Z])/g, "$1 $2");
    string = string.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
    string = string.replace("_", " ");
    return string;
  }
  // Update position of node in store
  function updatePosition() {
    if (position != null) {
      uploadedSources.update((nodes) => {
        let index = nodes.findIndex(
          (node) => node.fileName == sourceNode.fileName
        );
        nodes[index].position = position;
        return nodes;
      });
    }
  }
</script>

<Drawer
  placement="right"
  transitionType="fly"
  bind:hidden={hiddenBool}
  id="sidebar5"
  class="bg-transparent"
>
  <div class="node w-full">
    <div class="node-wrapper text-black">
      <CloseButton
        on:click={() => (hiddenBool = true)}
        class="mb-4 absolute right-7 dark:text-white"
      />
      <h3 class="text-3xl my-3">{insertSpaces(sourceNode.fileName)}</h3>
      <ul class="text-lg">
        <li>Type: {sourceNode.type}</li>
        {#if sourceNode.type === "Spatial"}
          <li>Geometry: {sourceNode.geometry}</li>
        {/if}

        {#if sourceNode.attributes}
          <section>
            <Datatable {handler} class="text-gray-700">
              <table>
                <thead>
                  <Th {handler} orderBy="name">Name</Th>
                  <Th {handler} orderBy="type">DataType</Th>
                  <Th {handler} orderBy="range">Range</Th>
                </thead>
                <tbody>
                  {#each $rows as row}
                    <tr>
                      <td>{@html row.name}</td>
                      <td>{@html row.dataType}</td>
                      <td>{@html row.dataType}</td>
                      <td>{@html row.range}</td>
                    </tr>
                  {/each}
                </tbody>
              </table>
            </Datatable>
          </section>
        {/if}
        <li>
          {#if sourceNode.source}
            Source: {sourceNode.source}
          {:else}
            <Label for="Source" class="!text-black text-lg ">Source</Label>
            <Input
              class="bg-inputField-200"
              placeholder="Provide a source link"
              name="citation"
            />
          {/if}
        </li>
        <li>
          <Label for="citation" class="!text-black text-lg">Citation</Label>
          <Textarea
            class="bg-inputField-200"
            placeholder="Please provide a citation before sharing"
            name="citation"
          />
        </li>
      </ul>
    </div>
  </div>
</Drawer>

<style>
  .node {
    width: 100%;
    height: auto;
    min-width: 3em;
    max-width: 50em;
    min-height: 90vh;
    background-color: #dbdbdb;
    border-radius: 8px;
    border: 5px double black;
  }
  .node-wrapper {
    margin: 1em;
    max-width: 15em;
    border-radius: 2px;
    background-color: transparent;
    line-break: after-white-space;
  }
</style>
