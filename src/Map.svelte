<svelte:options accessors={true} />

<script context="module">
  export let dbLayer;
  export let map;
</script>

<script>
  //Rewrite in maplibre-gl
  import { onMount } from "svelte";
  import maplibre from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";

  let mapContainer;

  onMount(() => {
    map = new maplibre.Map({
      container: mapContainer,
      style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
      center: [78.486328, 10.297698],
      pitch: 60, // pitch in degrees
      bearing: 30, // bearing in degrees
      zoom: 7,
      maxZoom: 10,
      minZoom: 3,
    }).addControl(
      new maplibre.AttributionControl({
        customAttribution: "Hindutva Watch Database",
      })
    );

  });

</script>

<main>
  <div id="map" bind:this={mapContainer} />
</main>

<style>
  #map {
    height: 100vh;
    width: 100vw;
    padding: 0 !important;
    margin: 0 !important;
  }

  .btn {
    margin: 0.04em;
  }

  .popup {
    width: 800px;
  }

  .btn-sm {
    padding: 0.1em 0.3em !important;
  }
</style>
