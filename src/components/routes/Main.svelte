<script>
  import Map, { map } from "../Map.svelte";
  import ResearchMap from "../ResearchMap.svelte";
  import Filter from "../Filter.svelte";
  import FileUploadModal from "../FileUploadModal.svelte";
  import FileNavigator from "../FileNavigator.svelte";

  import SearchSemanticScholar from "../SearchSemanticScholar.svelte";
  import {
    Drawer,
    Button,
    CloseButton,
    Accordion,
    AccordionItem,
  } from "flowbite-svelte";
  import { OpenBookSolid } from "flowbite-svelte-icons";

  export let supabase;
  let hiddenResearchMap = true;
</script>

<main>
  <section id="left-bar" class="p-4">
    <div id="meta-info" class="">
      <h1 class="font-bold text-3xl">Narrative Maker</h1>
      <p>This is a prototype to explore linked stories of geospatial data</p>
    </div>

    <Accordion flush>
      <aside id="data-ops">
        <AccordionItem
          class="bg-primary-50 !py-0"
          paddingFlush="py-1"
          padding="p-0"
        >
          <h3 slot="header">Filter</h3>
          <section id="data-ops-inner">
            <div id="filter" class="m-3 px-3">
              <Filter />
            </div>
          </section>
        </AccordionItem>
      </aside>

      <aside id="sources">
        <AccordionItem class="bg-primary-50" paddingFlush="py-1" open>
          <h3 slot="header">Sources</h3>
          <section id="sources-inner">
            <div id="parseFile" class="m-2 px-3">
              <FileNavigator />
            </div>

            <div id="searchSemanticScholar" class="m-2 px-3">
              <SearchSemanticScholar />
            </div>
          </section>
        </AccordionItem>
      </aside>
    </Accordion>
  </section>
  <section id="mapContainer">
    <Map />
  </section>

  <span id="right-bar-trigger" class="text-center">
    <Button
      color="dark"
      class="z-10 absolute bg-primary-50 text-black hover:text-white top-5 right-5 w-50"
      on:click={() => (hiddenResearchMap = false)}
    >
      <OpenBookSolid color="light" svgClass="mr-3" />Open research map</Button
    >
  </span>
  <Drawer
    placement="right"
    transitionType="fly"
    bind:hidden={hiddenResearchMap}
    id="research-map-container"
  >
    <CloseButton on:click={() => (hiddenResearchMap = true)} id="closeButton" />
    <section id="markup" class="">
      <h2 class="text-2xl">Research map</h2>
      <p class="">
        Imagine this to be a mindmap. Draw connections between documents as you
        go along
      </p>
    </section>

    <ResearchMap {supabase} />
  </Drawer>
  <FileUploadModal />
</main>

<style global>
  main {
    max-height: 100vh;
    overflow: hidden;
  }
  :global(#closeButton) {
    position: absolute;
    top: 2%;
    right: 2%;
    background-color: #475569;
  }
  #markup {
    margin-bottom: 1em;
    padding: 0em;
    font-size: larger;
  }
  main {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
  #mapContainer {
    width: 100vw;
    height: 100vh;
  }
  #left-bar {
    position: absolute;
    z-index: 5;
    top: 0;
    left: 0;
    max-height: 100vh;
    text-align: left;
    width: 20%;
    color: black;
  }

  #sources,
  #data-ops,
  #meta-info {
    border-radius: 10px;
    width: 100%;
    margin-bottom: 1em;
    color: black;
    border: 5px double black;
    background-color: #faebd7;
  }

  #meta-info {
    padding: 1em;
  }
  :global(.card) {
    padding: 0.2em;
  }
  :global(.card-header) {
    padding: 0em;
    color: black !important;
  }

  #right-bar-trigger {
    position: absolute;
    top: 2%;
    right: 2%;
    z-index: 2;
  }
  :global(#research-map-container) {
    position: absolute;
    top: 0%;
    right: 0%;
    width: 90vw;
    height: 90vh;

    margin: 2% 5%;
    padding: 2em;
    text-align: left;
    color: black;
    border-radius: 10px;
    background-color: antiquewhite;

    border: 4px double black;
  }
</style>
