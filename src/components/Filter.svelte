<script>
  import { map, dbLayer } from "./Map.svelte";
  import maplibre from "maplibre-gl";
  import { uploadedSources } from "../stores";
  import { Select, Label, Button, Dropdown, Search } from "flowbite-svelte";

  // searches a geojson layer for a given string
  // zooms to the first result
  // returns the number of results

  let selectedLayer;
  let selectedAttribute, selectedAttributeValue;
  // iterate over the properties of the first feature in the geojson object

  export async function search(
    selectedLayer,
    selectedAttribute,
    selectedAttributeValue
  ) {
    map.setFilter(selectedLayer, [
      "==",
      ["get", selectedAttribute.name],
      selectedAttributeValue,
    ]);
  }

  function clearAllFilters() {
    map.setFilter(selectedLayer, null);
  }
</script>

<Label for="layerSelect">Select a layer</Label>
<Select id="layerSelect" size="sm" class="p-0 px-1" bind:value={selectedLayer}>
  <option selected value="all">All</option>
  {#each $uploadedSources as source}
    <option value={source.name}>{source.fileName}</option>
  {/each}
</Select>

<Label for="attribute-select">Select an attribute</Label>
<Select
  id="attribute-select"
  size="sm"
  class="p-0 px-1"
  bind:value={selectedAttribute}
>
  {#each $uploadedSources as source}
    {#each source.attributes as attribute}
      <option value={attribute}
        ><span class="text-3xs">{attribute.dataType}</span>
        {attribute.name}</option
      >
    {/each}
  {/each}
</Select>

{#if selectedAttribute && selectedAttribute.dataType === "string"}
  <Select
    id="value-select"
    size="sm"
    class="p-0 px-1"
    bind:value={selectedAttributeValue}
  >
    {#each $uploadedSources as source}
      {#each source.attributes as attribute}
        {#if attribute.name === selectedAttribute.name}
          {#each attribute.values as value}
            <Search />
            <option {value}>{value}</option>
          {/each}
        {/if}
      {/each}
    {/each}
  </Select>
{/if}

<Button
  on:click={() =>
    search(selectedLayer, selectedAttribute, selectedAttributeValue)}
  class="rounded-md p-1 mt-2 bg-slate-800"
  id="search-button">Filter</Button
>

<Button on:click={clearAllFilters} class="rounded-md p-1 mt-2 bg-slate-800">
  Clear all filters</Button
>
