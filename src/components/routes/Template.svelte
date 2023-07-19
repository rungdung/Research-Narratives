<script>
  /* By Connor Rothschild https://twitter.com/CL_Rothschild
	Scrollytelling component from Russell Goldenberg https://twitter.com/codenberg/status/1432774653139984387 */

  import Scrolly from "../Scrolly.svelte";
  import Map, { map } from "../Map.svelte";
  import { narrativeNodes } from "../../stores";
  import { zoomToFeature } from "../../utils/mapMovements.mjs";
  import { Marker, Popup } from "maplibre-gl";
  import { tick } from "svelte";

  // get from local storage and parse
  let steps, value, node, title, subtitle;
  let mapContainer;

  $: steps = $narrativeNodes;

  $: if (steps && steps.length > 0) {
    title = steps[0].label;
    subtitle = steps[0].notes;
    steps = steps.splice(1);
  }

  function zoomToFocus(node) {
    if (node.narrativeData.mapFeature && map) {
      let mapFeature = node.narrativeData.mapFeature;
      zoomToFeature(mapFeature, null, map, node.type);
    } else if (node.narrativeData.filterExpression && map) {
      zoomToFeature(null, node.narrativeData.source, map, "collection");
    }
  }

  function toggleMapContainer(status = null) {
    if (mapContainer.style.display == "none" || status == "show") {
      mapContainer.style.display = "block";
    } else if (status == "hide" || mapContainer.style.display == "block") {
      mapContainer.style.display = "none";
    }
  }
</script>

{#if steps.length > 1}
  <section>
    <div class="hero">
      <h1 class="text-10xl">
        {title}
      </h1>
      <h2 class="text-2xl">
        {subtitle}
      </h2>
    </div>
    <div class="section-container">
      <div class="steps-container">
        <Scrolly bind:value>
          {#each steps as text, i}
            {#if i >= 0}
              <div class="step" class:active={value == i}>
                <div class="step-content">
                  <h2 class="text-5xl">
                    {@html text.label ?? steps[value].label}
                  </h2>
                  <p>{@html text.notes}</p>
                </div>
              </div>
            {/if}
          {/each}
          <div class="spacer" />
        </Scrolly>
      </div>
      <div class="sticky">
        <section id="map-container" bind:this={mapContainer}>
          <Map />
        </section>
        {#if value < steps.length}
          {#await tick()}
            <p>... loading</p>
          {:then}
            {#key value}
              {#if steps[value].narrativeData != null}
                {#if steps[value].narrativeData.images != null}
                  {toggleMapContainer("hide")}
                  <section class="image-container">
                    {#each steps[value].narrativeData.images as item}
                      <img src={item} alt="preview" class="image-preview" />
                    {/each}
                  </section>
                {/if}
                {#if steps[value].narrativeData.mapFeature != null}
                  {toggleMapContainer("show")}
                  {zoomToFocus(steps[value])}
                {/if}
                {#if steps[value].narrativeData.filterExpression != null}
                  {toggleMapContainer("show")}
                  {map.setFilter(
                    steps[value].narrativeData.targetLayer,
                    steps[value].narrativeData.filterExpression
                  )}
                  {zoomToFocus(steps[value])}
                {/if}
              {/if}
            {/key}
          {/await}
        {/if}
      </div>
    </div>
  </section>
  <footer class="hero">
    <h1>Thanks!</h1>
    <h2>
      <a href="" target="_blank">Github</a>
    </h2>
  </footer>
{/if}

<style>
  :global(body) {
    overflow-x: hidden;
  }

  .image-container {
    position: absolute;
    top: 0;
    left: 0;
    margin: 1em 1em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    object-fit: contain;
  }

  .image-preview {
    max-width: 100vh;
    max-height: 100vh;
    margin: 1em;
  }

  .hero {
    height: 70vh;
    display: flex;
    place-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 5em;
  }

  .hero h2 {
    margin-top: 0;
    font-weight: 200;
    padding: 2em 5em 0em 5em;
  }

  .spacer {
    height: 40vh;
  }

  .sticky {
    position: sticky;
    height: 100vh;
    top: 0%;
    flex: 1 1 60%;
    width: 60%;
  }

  .section-container {
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
  }

  .step {
    height: 80vh;
    display: flex;
    place-items: center;
    justify-content: center;
  }

  .step-content {
    font-size: 1rem;
    background: whitesmoke;
    color: #ccc;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: background 500ms ease;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    text-align: left;
    width: 75%;
    margin: auto;
    max-width: 500px;
  }

  .step.active .step-content {
    background: white;
    color: black;
  }

  .steps-container,
  .sticky {
    height: 100%;
  }

  .steps-container {
    flex: 1 1 40%;
    z-index: 10;
  }

  /* Comment out the following line to always make it 'text-on-top' */
  @media screen and (max-width: 768px) {
    .section-container {
      flex-direction: column-reverse;
    }
    .sticky {
      width: 95%;
      margin: auto;
    }
  }
</style>
