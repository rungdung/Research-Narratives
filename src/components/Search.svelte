<script>

  import { map, dbLayer } from "./Map.svelte";
  let searchQuery;
  // searches a geojson layer for a given string
  // zooms to the first result
  // returns the number of results


  export function searchLayer() {
    map.get
    // Loop through all layers in the dbLayer group and filter based on search query
    map.setFilter("dbLayer", ["in", ["get", "excerpt"], "Dalit" ]); //,

  }
</script>

<input
  type="text"
  id="search-input"
  bind:value={searchQuery}
  class="rounded-md text-white p-1 w-40 bg-slate-700"
  placeholder="Search for an event"
/>
<button
  on:click={() => searchLayer()}
  class="rounded-md p-1 mt-2 bg-slate-700"
  id="search-button">Search</button
>
