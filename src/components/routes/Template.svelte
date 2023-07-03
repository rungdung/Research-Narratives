<script>
  /* By Connor Rothschild https://twitter.com/CL_Rothschild
	Scrollytelling component from Russell Goldenberg https://twitter.com/codenberg/status/1432774653139984387 */

  import Scrolly from "../Scrolly.svelte";
  // import Scatterplot from "./Scatterplot.svelte";

  // get from local storage and parse
  let steps;
  $: steps = JSON.parse(localStorage.getItem("narrativeNodes"));
  let value;
</script>

<section>
  <div class="hero">
    <h1>This is a template story for the Narrative Making project at IIHS</h1>
  </div>
  <div class="section-container">
    <div class="steps-container">
      <Scrolly bind:value>
        {#key steps}
          {#each steps as text, i}
            <div class="step" class:active={value === i}>
              <div class="step-content">
                <h2 class="text-3xl">{@html text.label}</h2>
                <p>{@html text.notes}</p>
              </div>
            </div>
          {/each}
        {/key}
        <div class="spacer" />
      </Scrolly>
    </div>
    <div class="sticky">
      <!-- <Scatterplot step={value} /> -->
    </div>
  </div>
  <div class="hero">
    <h1>Thanks!</h1>
    <h2>
      <a href="" target="_blank">Questions and Tips</a>
    </h2>
  </div>
</section>

<style>
  :global(body) {
    overflow-x: hidden;
  }

  .hero {
    height: 60vh;
    display: flex;
    place-items: center;
    flex-direction: column;
    justify-content: center;
    text-align: center;
  }

  .hero h2 {
    margin-top: 0;
    font-weight: 200;
  }

  .spacer {
    height: 40vh;
  }

  .sticky {
    position: sticky;
    top: 10%;
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
