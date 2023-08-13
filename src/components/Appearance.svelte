<script>
  import { map, dbLayer } from "./Map.svelte";
  import Legend from "./Legend.svelte";
  import { uploadedSources } from "../stores";
  import {
    Select,
    Label,
    Button,
    Dropdown,
    Search,
    NumberInput,
  } from "flowbite-svelte";
  import { BinGuru } from "binguru";
  import chroma from "chroma-js";
  import { createEventDispatcher } from "svelte";
  import Alert from "./Alerts.svelte";

  let attributes;
  let selectedLayer,
    selectedAttribute,
    selectedBinCount,
    selectedAttributeRange,
    selectedMethod,
    selectedColourScale;
  let paintProperty, fullExpression;
  let legendContainer;
  let binned, breaks;
  let dispatch = createEventDispatcher();
  // save attributes to a variable for looping in svelte
  $: attributes = selectedLayer?.attributes;

  // Generate bins for the selected range
  // each element will contain the lower and upper value of the bin
  $: selectedAttributeRange = selectedAttribute?.range;

  // Available binning methods
  const methods = [
    { name: "equalInterval" },
    { name: "percentile" },
    { name: "quantile" },
    { name: "standardDeviation" },
    { name: "maximumBreaks" },
    { name: "prettyBreaks" },
    { name: "ckMeans" },
    { name: "headTailBreaks" },
    { name: "fisherJenks" },
    { name: "exponentialBinSizes" },
    { name: "geometricInterval" },
  ];

  async function setChloropleth() {
    // Change the colours of the layer based on
    // the selected attribute
    // and the bin size

    // Detect geometry to apply expressions to
    switch (selectedLayer.geometry) {
      case "MultiPolygon":
      case "Polygon":
        paintProperty = "fill-color";
        break;
      case "MultiLineString":
      case "LineString":
        paintProperty = "line-color";
        break;
      case "MultiPoint":
      case "Point":
        paintProperty = "circle-color";
        break;
    }

    // Get bin object from the selected attribute
    // and the selected bin size
    let binMain = new BinGuru(
      [...selectedAttribute.numericValues],
      selectedBinCount,
      null,
      1
    );
    // Bin by method
    switch (selectedMethod) {
      case "equalInterval":
        binned = await binMain.equalInterval();
        break;
      case "fisherJenks":
        binned = await binMain.fisherJenks();
        break;
      case "geometricInterval":
        binned = await binMain.geometricInterval();
        break;
      case "headTailBreaks":
        binned = await binMain.headTailBreaks();
        break;
      case "maximumBreaks":
        binned = await binMain.maximumBreaks();
        break;
      case "percentile":
        binned = await binMain.percentile();
        break;
      case "prettyBreaks":
        binned = await binMain.prettyBreaks();
        break;
      case "quantile":
        binned = await binMain.quantile();
        break;
      case "standardDeviation":
        binned = await binMain.standardDeviation();
        break;
      case "ckMeans":
        binned = await binMain.ckMeans();
        break;
      case "exponentialBinSizes":
        binned = await binMain.exponentialBinSizes();
        break;
    }

    // Colour scale
    let cols = chroma.scale("Viridis");

    // Zip the bin breaks with the colour scale
    breaks = await binned.binBreaks.map((breakPoint, index) => {
      let color = cols(index / binned.binBreaks.length).hex();
      let zipped = [breakPoint, color];
      return zipped;
    });

    // delete the array from memory
    binned = null;

    // Create the expression for the map
    let colorExpression = [
      "interpolate",
      ["linear"],
      ["get", selectedAttribute.name],
    ];

    // Construct with breaks
    fullExpression = colorExpression.concat(breaks.flat());

    // Delete the array from memory
    breaks = null;

    map.setPaintProperty(selectedLayer.name, paintProperty, null);
    map.setPaintProperty(selectedLayer.name, paintProperty, fullExpression);
    updateExpressionToSource();

    new Alert({
      target: document.body,
      props: {
        pos: "right",
        content: "Choropleth applied",
      },
    });
  }

  async function updateExpressionToSource() {
    // Change uploaded sources store to contain this
    // new expression
    let parentSource = $uploadedSources.find(
      (source) => selectedLayer.fileName === source.fileName
    );
    parentSource.appearanceExpression = fullExpression;
    dispatch("layerStyled", parentSource);
  }

  async function setColors() {
    map.setFilter(selectedLayer, null);
  }
</script>

{#if $uploadedSources.length > 0}
  <Label for="layerSelect">Select a layer to modify</Label>
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
{/if}

{#if attributes}
  <Label for="attribute-select">Attribute to colour by</Label>
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

{#if selectedAttribute && selectedAttribute.dataType === "numeric"}
  <Label for="method-select">Method</Label>
  <Select
    id="method-select"
    size="sm"
    class="p-0 px-1 my-1"
    bind:value={selectedMethod}
  >
    {#each methods as method}
      <option value={method.name}>{method.name}</option>
    {/each}
  </Select>
  <Label for="value-select">Bin size</Label>
  <NumberInput
    id="value-select"
    size="sm"
    class="p-0 px-1"
    bind:value={selectedBinCount}
  />

  <Button
    class="rounded-sm px-1 py-0 mt-2 bg-slate-800"
    color="primary"
    size="sm"
    on:click={setChloropleth}
    disabled={!selectedBinCount}
  >
    Create Choropleth</Button
  >
{/if}

{#if selectedAttribute && selectedAttribute.dataType == "string"}
  <Button
    class="rounded-sm px-1 py-0 mt-2 bg-slate-800"
    color="primary"
    size="sm"
    on:click={setColors}
  >
    Create Choropleth</Button
  >
{/if}

<style>
  #Legend {
    position: absolute;
    bottom: 0;
    right: 0;
  }
  :global(.rangeSlider) {
    font-size: 0.7rem !important;
  }
</style>
