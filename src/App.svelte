<script>
  import Map from "./components/Map.svelte";
  import ResearchMap from "./components/ResearchMap.svelte";
  import Search from "./components/Search.svelte";
  import UploadData from "./components/FileUploadModal.svelte";
  import Filter from "./components/Filter.svelte";
  import ParseFile from "./components/FileNavigator.svelte";

  import SearchSemanticScholar from "./components/SearchSemanticScholar.svelte";
  import Split from "split.js/dist/split.es.js";
  import { map } from "./components/Map.svelte";
  import maplibre from "maplibre-gl";

  import { CollapsibleCard } from "svelte-collapsible";

  import { onMount } from "svelte";

  let innerWidth;
  let innerHeight;
</script>

<main>
  <div id="mapContainer">
    <Map />
    <div id="left-bar" class="p-4">
      <div id="meta-info" class="">
        <h1 class="font-bold text-4xl">Narrative Maker</h1>
        <h3>
          This is a prototype to explore linked stories of geospatial data
        </h3>
      </div>

      <aside id="data-ops">
        <CollapsibleCard>
          <h3 slot="header">Data operations</h3>
          <section slot="body" id="data-ops-inner">
            <div id="search" class="m-2">
              <Search />
            </div>

            <div id="filter" class="m-2">
              <!--<Filter/>-->
            </div>
          </section>
        </CollapsibleCard>
      </aside>

      <aside id="sources">
        <CollapsibleCard>
          <h3 slot="header">Sources</h3>
          <section slot="body" id="sources-inner">
            <div id="parseFile" class="m-2">
              <ParseFile />
            </div>

            <div id="searchSemanticScholar" class="m-2">
              <SearchSemanticScholar />
            </div>
          </section>
        </CollapsibleCard>
      </aside>
    </div>
  </div>

  <div id="right-bar" class="p-5">
    <section id="markup" class="font-semibold">
      <h2 class="">Research map</h2>
      <h2 class="">
        Imagine this to be a mindmap. Draw connections between documents as you
        go along
      </h2>
    </section>

    <ResearchMap />
  </div>
  <UploadData />
</main>

<svelte:window bind:innerWidth bind:innerHeight />
<svelte:head>
  <title>Research narrative building</title>
</svelte:head>

<style>
  #markup {
    margin-bottom: 2em;
    padding: 1em;
    font-size: larger;
  }
  main {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
  #mapContainer {
    width: 50vw;
    height: 100vh;
  }
  #left-bar {
    position: absolute;
    top: 2%;
    left: 2%;
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
    padding: 1em;
    margin-top: 1em;
    color: black;
    background-color: antiquewhite;
  }
  :global(.card) {
    padding: 0.2em;
  }
  :global(.card-header) {
    padding: 0em;
    color: black !important;
  }

  #right-bar {
    max-width: 50% !important;
    padding: 0em !important;
    z-index: 2;
    text-align: left;
    color: black;
    background-color: antiquewhite;
  }
</style>
