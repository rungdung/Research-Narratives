<script>
  import { loadDataFromDB } from "./utils/loadFromDB.mjs";
  import {
    uploadedSources,
    markupNodes,
    narrativeNodes,
    annotationNodes,
    loadedSources,
  } from "./stores";

  import { Route, Router } from "svelte-routing";
  import Template from "./components/routes/Template.svelte";
  import Main from "./components/routes/Main.svelte";

  import { PenNibOutline } from "flowbite-svelte-icons";

  export let supabase;

  // Final Bool to ensure DB has returned data
  let storesUpdated = false;

  // set stores
  let returnFromDB = loadDataFromDB(supabase);

  // set local stores to data from DB
  async function loadStoresFromDB() {
    try {
      await returnFromDB
        .then(async (data) => {
          await uploadedSources.set(data.sourceNodes);
          await markupNodes.set(data.markupNodes);
          await narrativeNodes.set(data.narrativeNodes);
          await annotationNodes.set(data.annotationNodes);
        })
        .then(() => (storesUpdated = true));
    } catch (error) {
      console.log(error);
      storesUpdated = true;
    }
  }

  loadStoresFromDB();

  // trigger reactivity
  $: $uploadedSources, $loadedSources;
</script>

{#key storesUpdated}
  {#if storesUpdated}
    <Router>
      <Route path="/RenderedStory">
        {#if $loadedSources.size != $uploadedSources.length}
          <section
            class="flex justify-center items-center text-left text-xl h-screen z-100"
          >
            <PenNibOutline size="60" class="text-9xl animate-bounce" />
            Your narrative data is loading! {$loadedSources.size} /{" "}
            {$uploadedSources.length}
          </section>
        {/if}
        <Template />
      </Route>

      <Route path="/">
        <Main {supabase} />
      </Route>
    </Router>
  {:else}
    <section
      class="flex justify-center items-center text-left text-xl h-screen"
    >
      <PenNibOutline size="60" class="text-9xl animate-bounce" />
      Your narrative environment is loading!
    </section>
  {/if}
{/key}
<svelte:window />
<svelte:head>
  <title>Research Narratives</title>
</svelte:head>
