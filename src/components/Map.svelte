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

  import { loadSources } from "../utils/loadFromDB.mjs";
  import { uploadedSources } from "../stores";

  import Alert from "./Alerts.svelte";

  const maptilerKey = import.meta.env.VITE_MAPTILER_KEY;

  let mapContainer;

  let sourceLoading, sourceLoaded;

  onMount(() => {
    map = new maplibre.Map({
      container: mapContainer,
      style:
        "https://api.maptiler.com/maps/47780736-e784-40ca-9f2e-6da4248ada51/style.json?key=" +
        maptilerKey,
      center: [78.398438, 21.616579],
      pitch: 0, // pitch in degrees
      bearing: 0, // bearing in degrees
      zoom: 1,
      maxZoom: 14,
      minZoom: 3,
    });

    map.on("load", () => {
      loadSources($uploadedSources);
    });

    map.on("sourcedataloading", (e) => {
      if (e.sourceId != sourceLoading) {
        //check if source exists in uploaded sources
        if (
          $uploadedSources.find((source) => {
            return source.fileName == e.sourceId;
          })
        ) {
          sourceLoading = e.sourceId;
        }
      }
    });

    map.on("sourcedata", (e) => {
      if (
        $uploadedSources.find((source) => {
          return source.fileName == e.sourceId;
        })
      ) {
        if (e.sourceId != sourceLoaded) {
          sourceLoaded = e.sourceId;
        }
      }
    });

    map.on("");
    map.resize();
  });
</script>

<div id="map" bind:this={mapContainer} />

{#key sourceLoading}
  {#if sourceLoading != undefined}
    <Alert pos="bottom" content="{sourceLoading} is loading" />
  {/if}
{/key}

{#key sourceLoaded}
  {#if sourceLoaded != undefined}
    <Alert pos="bottom" content="{sourceLoaded} is loaded" />
  {/if}
{/key}

<style>
  #map {
    height: 100vh;
    padding: 0 !important;
    margin: 0 !important;
  }
</style>
