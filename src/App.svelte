<script>
  import Map from "./components/Map.svelte";
  import SelectedFeatures from "./components/ResearchMap.svelte";
  import Search from "./components/Search.svelte";
  import UploadData from "./components/FileRenderer.svelte";
  import Filter from "./components/Filter.svelte";
  import ParseFile from "./components/FileHandler.svelte";

  import SearchSemanticScholar from "./components/SearchSemanticScholar.svelte";
  import Split from "split.js/dist/split.es.js";
  import { map } from "./components/Map.svelte";
  import maplibre from "maplibre-gl";

  import { CollapsibleCard } from "svelte-collapsible";

  import { onMount } from "svelte";

  let innerWidth;
  let innerHeight;

  let height;

  $: height = innerHeight / 1.5;
  $: width = innerWidth / 2;

  // Creates a split pane
  // Testing out the split.js library
  // Load after map has loaded to ensure that there are no visual black spots
  onMount(() => {
    Split(["#mapContainer", "#right-bar"], {
        maxSize: 1200,
        sizes: [70, 30], //default load
        snapOffset: 30,
      });
    map.on("load", () => {
      map.resize();
    });
  });
</script>

<main>
  <div id="split">
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
      <h2 class="font-semibold text-3xl p-2">Research map</h2>
      <h2 class="text-1xl p-3">
        Imagine this to be a mindmap. Draw connections between documents as you
        go along
      </h2>
      <SelectedFeatures {height} />
    </div>
  </div>
  <UploadData />
</main>

<svelte:window bind:innerWidth bind:innerHeight />
<svelte:head>
  <title>Research narrative building</title>
</svelte:head>

<style>
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
  :global(.card){
    padding: 0.2em;
  }
  :global(.card-header){
    padding: 0em;
    color: black !important;
  }
  
  #right-bar {
    max-width: 80% !important;
    border-radius: 2px !important;
  }
  #right-bar {
    max-height: 100vh;
    z-index: 2;
    padding: 1em;
    text-align: left;
    color: black;
    border-radius: 10px;
    background-color: antiquewhite;
  }

  #split {
    display: flex;
    flex-direction: row;
    width: 100vw;
  }

  :global(.gutter) {
    background-color: #ccc;
    background-repeat: no-repeat;
    background-position: 50%;
  }

  :global(.gutter.gutter-horizontal) {
    background-image: url("PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIiA/Pgo8IURPQ1RZUEUgc3ZnIFBVQkxJQyAiLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4iICJodHRwOi8vd3d3LnczLm9yZy9HcmFwaGljcy9TVkcvMS4xL0RURC9zdmcxMS5kdGQiPgo8c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgd2lkdGg9IjEwODAiIGhlaWdodD0iMTA4MCIgdmlld0JveD0iMCAwIDEwODAgMTA4MCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CjxkZXNjPkNyZWF0ZWQgd2l0aCBGYWJyaWMuanMgNS4yLjQ8L2Rlc2M+CjxkZWZzPgo8L2RlZnM+CjxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ij48L3JlY3Q+CjxnIHRyYW5zZm9ybT0ibWF0cml4KDEgMCAwIDEgNTQwIDU0MCkiIGlkPSJjMWMxOGE1OC05ODIyLTQ5ZDMtODk4Ny02OTJmM2MxMTc2ZmYiICA+CjxyZWN0IHN0eWxlPSJzdHJva2U6IG5vbmU7IHN0cm9rZS13aWR0aDogMTsgc3Ryb2tlLWRhc2hhcnJheTogbm9uZTsgc3Ryb2tlLWxpbmVjYXA6IGJ1dHQ7IHN0cm9rZS1kYXNob2Zmc2V0OiAwOyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogNDsgZmlsbDogcmdiKDI1NSwyNTUsMjU1KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyB2aXNpYmlsaXR5OiBoaWRkZW47IiB2ZWN0b3ItZWZmZWN0PSJub24tc2NhbGluZy1zdHJva2UiICB4PSItNTQwIiB5PSItNTQwIiByeD0iMCIgcnk9IjAiIHdpZHRoPSIxMDgwIiBoZWlnaHQ9IjEwODAiIC8+CjwvZz4KPGcgdHJhbnNmb3JtPSJtYXRyaXgoMSAwIDAgMSA1NDAgNTQwKSIgaWQ9ImRiZjRhNzM1LTU4ZDEtNDA0Ni1hZjU5LTBlNjgzNzNhYzY2NyIgID4KPC9nPgo8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLjI5IDAgMCAxLjI5IDUyNy41NCA1MTcuNjcpIiBpZD0iZWI2YWQ5MmYtNGM3OS00ZmFhLTlhN2ItZGM2YTc2M2YzYjE0IiAgPgo8cGF0aCBzdHlsZT0ic3Ryb2tlOiByZ2IoMCwwLDApOyBzdHJva2Utd2lkdGg6IDg7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtZGFzaG9mZnNldDogMDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDQ7IGZpbGw6IHJnYigyNTUsMjU1LDI1NSk7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHZlY3Rvci1lZmZlY3Q9Im5vbi1zY2FsaW5nLXN0cm9rZSIgIHRyYW5zZm9ybT0iIHRyYW5zbGF0ZSgtMTIsIC0xMikiIGQ9Ik0gMTYuNjcgMCBMIDE5LjUgMi44MjkgTCAxMC4xNjEgMTIuMDA0MDAwMDAwMDAwMDAxIEwgMTkuNSAyMS4xNzEgTCAxNi42NyAyNCBMIDQuNTAwMDAwMDAwMDAwMDAyIDEyLjAwNCB6IiBzdHJva2UtbGluZWNhcD0icm91bmQiIC8+CjwvZz4KPC9zdmc+");
    cursor: col-resize;
  }
</style>
