<script>
  import Map from "./components/Map.svelte";
  import ResearchMap from "./components/ResearchMap.svelte";
  import Search from "./components/Search.svelte";
  import FileUploadModal from "./components/FileUploadModal.svelte";
  import FileNavigator from "./components/FileNavigator.svelte";
  import { loadDataFromDB } from "./utils/loadFromDB.mjs";
  import { uploadedSources, markupNodes, narrativeNodes } from "./stores";
  import SearchSemanticScholar from "./components/SearchSemanticScholar.svelte";

  import { CollapsibleCard } from "svelte-collapsible";

  import { onMount } from "svelte";
  import { Drawer, Button, CloseButton } from "flowbite-svelte";
  import { sineIn } from "svelte/easing";

  import { Route, Router } from "svelte-routing";
  import Template from "./components/routes/Template.svelte";

  let hiddenResearchMap = true;
  let transitionParams = {
    x: -320,
    duration: 700,
    easing: sineIn,
  };

  export let supabase;

  //set stores
  let returnFromDB = loadDataFromDB(supabase);

  onMount(() => {
    try {
      returnFromDB.then((data) => {
        uploadedSources.set(data.sourceNodes);
        markupNodes.set(data.markupNodes);
        narrativeNodes.set(data.narrativeNodes);
      });
    } catch (error) {
      console.log(error);
    } finally {
      return null;
    }
  });
</script>

<Router url="">
  <Route path="/RenderedStory" let:params>
    <Template />
  </Route>

  <Route path="/">
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
                  <FileNavigator />
                </div>

                <div id="searchSemanticScholar" class="m-2">
                  <SearchSemanticScholar />
                </div>
              </section>
            </CollapsibleCard>
          </aside>
        </div>
      </div>

      <span id="right-bar-trigger" class="text-center">
        <Button
          color="light"
          class="z-10 "
          on:click={() => (hiddenResearchMap = false)}>Open research map</Button
        >
      </span>
      <Drawer
        placement="right"
        transitionType="fly"
        {transitionParams}
        bind:hidden={hiddenResearchMap}
        id="right-bar"
      >
        <CloseButton
          on:click={() => (hiddenResearchMap = true)}
          id="closeButton"
        />
        <section id="markup" class="">
          <h2 class="">Research map</h2>
          <h2 class="">
            Imagine this to be a mindmap. Draw connections between documents as
            you go along
          </h2>
        </section>

        <ResearchMap {supabase} />
      </Drawer>
      <FileUploadModal {supabase} />
    </main>
  </Route>
</Router>
<svelte:window />
<svelte:head>
  <title>Research narrative building</title>
</svelte:head>

<style>
  :global(#closeButton) {
    position: absolute;
    top: 2%;
    right: 2%;
    background-color: #475569;
  }
  #markup {
    margin-bottom: 2em;
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

  #right-bar-trigger {
    position: absolute;
    top: 2%;
    right: 2%;
    z-index: 2;
  }
  :global(#right-bar) {
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
  }
</style>
