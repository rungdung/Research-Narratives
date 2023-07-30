<script>
  import { map, dbLayer } from "./Map.svelte";
  import maplibre from "maplibre-gl";
  import { uploadedSources } from "../stores";
  import { Select, Label, Button, Dropdown, Search } from "flowbite-svelte";
  import RangeSlider from "svelte-range-slider-pips";
  import { addNewMarkupNodeCollection } from "../utils/addNewNodes.mjs";

  import Alert from "./Alerts.svelte";

  // searches a geojson layer for a given string
  // zooms to the first result
  // returns the number of results

  let selectedLayer;
  let attributes;
  let selectedAttribute,
    selectedAttributeValue,
    selectedAttributeRange = [0, 1];
  let filterExpression;
  // iterate over the properties of the first feature in the geojson object

  // save attributes to a variable for looping in svelte
  $: attributes = selectedLayer?.attributes;

  // slider formmating
  const num = new Intl.NumberFormat("en-IN");

  async function search() {
    filterExpression = [
      "all",
      ["==", ["get", selectedAttribute.name], selectedAttributeValue],
    ];
    map.setFilter(selectedLayer.name, filterExpression);
    new Alert({
      target: document.body,
      props: {
        pos: "right",
        content: "All filters cleared",
      },
    });
  }

  async function clearAllFilters() {
    map.setFilter(selectedLayer, null);
  }

  async function searchRange(selectedAttributeRange) {
    filterExpression = [
      "all",
      [">=", ["get", selectedAttribute.name], selectedAttributeRange[0]],
      ["<=", ["get", selectedAttribute.name], selectedAttributeRange[1]],
    ];
    map.setFilter(selectedLayer.name, filterExpression);
    new Alert({
      target: document.body,
      props: {
        pos: "right",
        content: "Filter applied",
      },
    });
  }

  function addToResearchMap() {
    addNewMarkupNodeCollection(
      selectedLayer.fileName,
      selectedLayer.name,
      filterExpression
    );

    new Alert({
      target: document.body,
      props: {
        pos: "right",
        content:
          "Filtered content from " +
          selectedLayer.fileName +
          " added to Research Map",
      },
    });
  }
  $: searchRange(selectedAttributeRange);
</script>

<Label for="layerSelect">Select a layer to filter from</Label>
<Select
  id="layerSelect"
  size="sm"
  class="p-0 px-1 my-1"
  bind:value={selectedLayer}
>
  <option selected value="all">All</option>
  {#each $uploadedSources as source}
    <option value={source}>{source.fileName}</option>
  {/each}
</Select>

{#if attributes}
  <Label for="attribute-select">Select an attribute</Label>
  <Select
    id="attribute-select"
    size="sm"
    class="p-0 px-1 my-1"
    bind:value={selectedAttribute}
  >
    {#each attributes as attribute}
      <option value={attribute}
        ><span class="text-3xs">{attribute.dataType}</span>
        {attribute.name}</option
      >
    {/each}
  </Select>
{/if}

{#if selectedAttribute && selectedAttribute.dataType === "string"}
  <Label for="value-select">Select a value</Label>
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
            <option {value}>{value}</option>
          {/each}
        {/if}
      {/each}
    {/each}
  </Select>
{/if}

{#if selectedAttribute && selectedAttribute.dataType === "numeric"}
  <Label for="value-select">Select a value</Label>
  <RangeSlider
    id="value-select"
    steps={900}
    bind:values={selectedAttributeRange}
    min={selectedAttribute.range[0]}
    max={selectedAttribute.range[1]}
    formatter={(v) => num.format(v * 1000)}
    range
    float
    pips
    first="label"
    last="label"
    step={10}
  />
{/if}

<Button
  on:click={clearAllFilters}
  class="rounded-sm px-1 py-0 mt-2 bg-slate-800"
>
  Clear all filters</Button
>

{#if selectedAttribute}
  <Button
    on:click={search}
    class="rounded-sm px-1 py-0 mt-2 bg-slate-800"
    id="search-button">Filter</Button
  >
  <Button
    on:click={addToResearchMap}
    class="rounded-sm px-1 py-0 mt-2 bg-slate-800"
  >
    Add to Research Map</Button
  >
{/if}

<style>
  :global(.rangeSlider) {
    font-size: 0.7rem !important;
  }
</style>
