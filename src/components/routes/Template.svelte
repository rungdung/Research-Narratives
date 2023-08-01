<script>
  /* By Connor Rothschild https://twitter.com/CL_Rothschild
	Scrollytelling component from Russell Goldenberg https://twitter.com/codenberg/status/1432774653139984387 */

  import scrollama from "scrollama"; // or...
  import Map, { map } from "../Map.svelte";
  import { narrativeNodes } from "../../stores";
  import { zoomToFeature } from "../../utils/mapMovements.mjs";
  import { Marker, Popup } from "maplibre-gl";
  import { onMount, tick } from "svelte";

  // get from local storage and parse
  let steps, globalScrollIndex, node, title, subtitle;
  let mapContainer;

  $: steps = $narrativeNodes;

  // get title and subtitle from first node
  $: if (steps && steps.length > 0) {
    title = steps[0].label;
    subtitle = steps[0].notes;
    steps = steps.splice(1);
  }

  function zoomToFocus(node) {
    if (node.narrativeData.mapFeature && map) {
      let mapFeature = node.narrativeData.mapFeature;
      zoomToFeature(mapFeature, null, map, node.type);
    } else if (node.narrativeData.targetLayer && map) {
      zoomToFeature(null, node.narrativeData.source, map, "collection");
    }
  }

  function clearFilters(value) {
    if (value >= 1 && value < steps.length - 2) {
      if (steps[value - 1].narrativeData.filterExpression != null) {
        map.setFilter(steps[value - 1].narrativeData.targetLayer, null);
      } else if (steps[value + 1].narrativeData.filterExpression != null) {
        map.setFilter(steps[value + 1].narrativeData.targetLayer, null);
      }
    }
  }

  function toggleMapContainer(
    status = null,
    clearFilterIndex = null,
    zoomTo = null
  ) {
    // Zoom to feature
    if (zoomTo != null) {
      zoomToFocus(zoomTo);
    }

    // Clear filter
    if (clearFilterIndex != null) {
      clearFilters(clearFilterIndex);
    }
    // Toggle map
    if (mapContainer.style.display == "none" || status == "show") {
      mapContainer.style.display = "block";
    } else if (status == "hide" || mapContainer.style.display == "block") {
      mapContainer.style.display = "none";
    }
  }

  // instantiate the scrollama
  const scroller = scrollama();

  // setup the instance, pass callback functions
  onMount(() => {
    // instantiate the scrollama
    const scroller = scrollama();

    scroller
      .setup({
        step: ".step",
        offset: 0.5,
      })
      .onStepEnter((response) => {
        if (
          response.index < steps.length &&
          steps[response.index].narrativeData
        ) {
          globalScrollIndex = response.index;
          if (steps[response.index].narrativeData.mapFeature) {
            toggleMapContainer("show", response.index, steps[response.index]);
          } else if (steps[response.index].narrativeData.targetLayer) {
            toggleMapContainer("show", response.index, steps[response.index]);
            map.setFilter(
              steps[response.index].narrativeData.targetLayer,
              steps[response.index].narrativeData.filterExpression == null
                ? null
                : steps[response.index].narrativeData.filterExpression
            );
          } else if (steps[response.index].narrativeData.images) {
            toggleMapContainer("hide");
          }
        }
      })
      .onStepExit((response) => {
        clearFilters(response.index);
      });
  });
</script>

{#if steps.length > 1}
  <section>
    <div class="hero">
      <h1 class="text-10xl">
        {@html title}
      </h1>
      <h2 class="text-2xl">
        {@html subtitle}
      </h2>
    </div>
    <div class="section-container">
      <div class="steps-container">
        {#each steps as text, i}
          <div class="step" class:active={i === globalScrollIndex}>
            <div class="step-content">
              <h2 class="text-5xl">
                {@html text.label}
              </h2>
              <p>{@html text.notes}</p>
            </div>
          </div>
        {/each}
        <div class="spacer" />
      </div>
      <div class="sticky">
        <section id="map-container" bind:this={mapContainer}>
          <Map />
        </section>
          {#if globalScrollIndex < steps.length && steps[globalScrollIndex].narrativeData && steps[globalScrollIndex].narrativeData.images}
            <section class="image-container">
              {#each steps[globalScrollIndex].narrativeData.images as item}
                <img src={item} alt="preview" class="image-preview" />
              {/each}
            </section>
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
