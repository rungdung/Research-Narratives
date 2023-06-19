<script>
import {map} from "./Map.svelte";
import {properties, propertyValues} from  "./UploadData.svelte";

let selectedProperty

const updateFilter = () => {
    // Apply the selected property as a filter
    if (map.getLayer("my-layer")) {
      map.setFilter("my-layer", ["==", selectedProperty, true]);
    }
  };

</script>


<h2>Filter by Property</h2>
<select bind:value={selectedProperty} on:change={updateFilter}>
  <option value="">All Properties</option>
  {#each properties as property}
    <option value={property}>{property}</option>
  {/each}
</select>

<h2>Property Values</h2>
{#if selectedProperty}
  <ul>
    {#each Array.from(propertyValues) as value}
      <li>{value}</li>
    {/each}
  </ul>
{/if}

