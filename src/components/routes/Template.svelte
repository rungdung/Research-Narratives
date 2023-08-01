<script>
  import Map, { map } from "../Map.svelte";
  import { narrativeNodes } from "../../stores";
  import { zoomToFeature } from "../../utils/mapMovements.mjs";
  import { onMount } from "svelte";
  import { uploadedSources } from "../../stores";
  import { Button } from "flowbite-svelte";
  import { AngleLeftSolid, AngleRightSolid } from "flowbite-svelte-icons";
  import { ScrollZoomHandler } from "maplibre-gl";

  let steps,
    globalScrollIndex = 0;

  // get from local storage and parse
  $: steps = $narrativeNodes;
  let currentText;

  let scrollY;

  let mapContainer;

  /**
   * Zoom to feature or features on map
   * @param node
   */
  function zoomToFocus(node) {
    if (node.narrativeData.mapFeature && map) {
      let mapFeature = node.narrativeData.mapFeature;
      zoomToFeature(mapFeature, null, map, node.type);
    } else if (node.narrativeData.targetLayer && map) {
      zoomToFeature(null, node.narrativeData.source, map, "collection");
    }
  }

  /**
   * Clear all filters on map
   */
  function clearFilters() {
    $uploadedSources.forEach((source) => {
      map.setFilter(source.name, null);
    });
  }

  /**
   * Toggle map container
   * @param {string} status - show or hide
   */
  async function toggleMapContainer(status = null) {
    // Toggle map
    if (status == "show") {
      mapContainer.style.opacity = "100%";
    } else if (status == "hide") {
      mapContainer.style.opacity = "50%";
    }
  }

  /**
   * On increment, update actions
   */
  $: currentText = steps[globalScrollIndex];
  $: if (globalScrollIndex < steps.length && currentText.narrativeData) {
    if (currentText.narrativeData.mapFeature) {
      toggleMapContainer("show");
      zoomToFocus(currentText);
    } else if (currentText.narrativeData.targetLayer) {
      clearFilters();
      map.setFilter(
        currentText.narrativeData.targetLayer,
        currentText.narrativeData.filterExpression == null
          ? null
          : currentText.narrativeData.filterExpression
      );
      zoomToFocus(currentText);
      toggleMapContainer("show");
    } else if (currentText.narrativeData.images) {
      clearFilters();
      toggleMapContainer("hide");
    }

    onMount(() => {
      toggleMapContainer("hide");
    });
  }
</script>

<svelte:window bind:scrollY />

{#if steps.length > 1}
  <section>
    <div class="section-container">
      <div class="steps-container">
        {#key currentText}
          <div class="step">
            <div class="step-content" class:hero={globalScrollIndex == 0}>
              <h2 class="text-5xl" class:heading={globalScrollIndex == 0}>
                {@html currentText.label}
              </h2>
              <p>{@html currentText.notes}</p>
            </div>
          </div>
        {/key}
        <!-- on button press increment globalScrollIndex-->
        <Button
          class="bg-gray-300 hover:bg-gray-400 rounded inline-flex items-center"
          on:click={() => {
            if (globalScrollIndex > 0) {
              globalScrollIndex--;
            }
          }}><AngleLeftSolid /></Button
        >
        <Button
          class="bg-gray-300 hover:bg-gray-400 rounded inline-flex items-center"
          on:click={() => {
            if (globalScrollIndex < steps.length - 1) {
              globalScrollIndex++;
            }
          }}><AngleRightSolid /></Button
        >

        <div class="spacer" />
      </div>
      <div class="sticky">
        <section id="map-container" bind:this={mapContainer}>
          <Map />
        </section>
        <section class="image-container blur-lg">
          {#if globalScrollIndex < steps.length && steps[globalScrollIndex].narrativeData && steps[globalScrollIndex].narrativeData.images}
            {#each steps[globalScrollIndex].narrativeData.images as item}
              <img
                src={item}
                alt="preview"
                class="image-preview backdrop-blur-xl"
              />
            {/each}
          {/if}
        </section>
      </div>
    </div>
  </section>
{:else}
  <section class="">
    You have not created a narrative on the research map!
  </section>
{/if}

<style>
  :global(body) {
    overflow-x: hidden;
  }

  .image-container {
    position: absolute;
    top: 0;
    left: 0;
    place-items: center;

    margin: auto 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    object-fit: contain;
  }

  .image-preview {
    object-fit: contain;
    height: 100vh;
    max-width: 100vh;
    max-height: 100vh;
    margin: 1em;
  }

  .hero {
    height: auto;
    display: flex;
    font: serif;

    /*move to the centre of the screen*/
    translate: transform(-50%, -50%);
    place-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    padding: 1em !important;
    width: 60vw !important;
    max-width: 70vw !important;
    margin: auto !important;
  }

  .heading {
    font-size: 4rem;
    line-height: 1.1em;
    font-weight: 600;
    padding: 0 !important;
    margin-bottom: 0.3em;
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
    position: fixed;
    top: 0;
    right: 0;
    height: 100vh;
    top: 0%;
    flex: 1 1 0%;
    width: 100vw;
  }

  .section-container {
    width: 80vw;
    margin-top: 1em;
    text-align: center;
    transition: background 100ms;
    display: flex;
  }

  .step {
    height: 70vh;
    display: flex;
    place-items: right;
    justify-content: right;
  }

  .step-content {
    font-size: 1rem;
    background: antiquewhite;
    color: black;
    border-radius: 5px;
    padding: 0.5rem 1rem;
    display: flex;
    flex-direction: column;
    justify-content: right;
    transition: background 500ms ease;
    box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.2);
    text-align: left;
    width: 75%;
    margin: auto 0;
    max-width: 500px;
  }

  .steps-container,
  .sticky {
    height: 100%;
  }

  .steps-container {
    position: fixed;
    top: 0;
    right: 0;
    width: 60vw;
    margin: 3em;
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
