<script>
import "leaflet-search/dist/leaflet-search.min.css";
import "leaflet-search";
import "leaflet";

import {map, dbLayer} from "./Map.svelte";
let searchQuery
// searches a geojson layer for a given string
// zooms to the first result
// returns the number of results
let searchResultsLayer = L.featureGroup();

export function searchLayer() {
  searchResultsLayer.clearLayers();
  // Loop through all layers in the dbLayer group and filter based on search query
  dbLayer.eachLayer(layer => {
    if (layer.feature.properties.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) {
      searchResultsLayer.addLayer(new L.CircleMarker(layer.getLatLng(), {
        radius: 30,
        color: "#ff7800",
        weight: 5,
        opacity: 0.65
        }));
    }
  });

  // If search results are found, zoom to the bounds of the search results layer and add to map
  if (searchResultsLayer.getLayers().length > 0) {
    
    //console.log(searchResultsLayer.getBounds());
    searchResultsLayer.addTo(map);
  } else {
    alert("No results found.");
  }
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
