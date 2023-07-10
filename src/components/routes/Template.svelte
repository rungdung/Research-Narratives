<script>
  /* By Connor Rothschild https://twitter.com/CL_Rothschild
	Scrollytelling component from Russell Goldenberg https://twitter.com/codenberg/status/1432774653139984387 */

  import Scrolly from "../Scrolly.svelte";
  import Map from "../Map.svelte";
  import { narrativeNodes } from "../../stores";
  import { zoomToFeature } from "../../utils/mapMovements.mjs";
  import { map } from "../Map.svelte";
  import { Marker, Popup } from "maplibre-gl";
  // import Scatterplot from "./Scatterplot.svelte";

  // get from local storage and parse
  let steps = $narrativeNodes;
  let value;
  let node;

  function zoomToFocus(node) {
    if (node.mapFeature && map) {
      zoomToFeature(node.mapFeature, map);
      new Marker()
        .setLngLat(node.mapFeature.geometry.coordinates)
        .setPopup(
          new Popup({
            focusAfterOpen: false,
          }).setHTML(
            `<h3>${node.mapFeature.properties.title}</h3><p>${node.mapFeature.properties.description}</p>`
          )
        )
        .addTo(map)
        .togglePopup();
    }
  }
</script>

<section>
  <div class="hero">
    <h1 class="text-10xl">
      {steps[0].label ?? "A story about a place"}
    </h1>
    <h2 class="text-2xl">
      {steps[0].notes ?? "Enter narrative text to accompany the section"}
    </h2>
  </div>
  <div class="section-container">
    <div class="steps-container">
      <Scrolly bind:value>
        {#each steps as text, i}
          {#if i > 0}
            <div class="step" class:active={value === i - 1}>
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
      {#if value < steps.length}
        <Map />
        {#key value}
          {#if steps[value].images}
            {console.log(steps[value])}
            {console.log(steps[value].images.images.accepted)}
            {#each steps[value].images.images.accepted as item}
              <img
                src={item}
                alt="preview"
                class="fixed top-0 right-2 w-100 block object-fill"
              />
            {/each}
          {:else if steps[value].mapFeature != null && map}
            {zoomToFocus(steps[value].mapFeature)}
          {/if}
        {/key}
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

<style>
  :global(body) {
    overflow-x: hidden;
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
