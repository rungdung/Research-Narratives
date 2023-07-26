<script>
  import { loadDataFromDB } from "./utils/loadFromDB.mjs";
  import {
    uploadedSources,
    markupNodes,
    narrativeNodes,
    annotationNodes,
  } from "./stores";

  import { onMount } from "svelte";

  import { Route, Router } from "svelte-routing";
  import Template from "./routes/Template.svelte";
  import Main from "./routes/Main.svelte";
  import Home from "./routes/Home.svelte";

  import Alert from "./components/Alerts.svelte";

  export let supabase;

  //set stores
  let returnFromDB = loadDataFromDB(supabase);

  onMount(() => {
    try {
      returnFromDB.then((data) => {
        uploadedSources.set(data.sourceNodes);
        markupNodes.set(data.markupNodes);
        narrativeNodes.set(data.narrativeNodes);
        annotationNodes.set(data.annotationNodes);
      });
    } catch (error) {
      console.log(error);
    } finally {
      return null;
    }
  });
</script>

<Router>
  <Route path="/demo/RenderedStory">
    <Template />
  </Route>

  <Route path="/demo">
    <Main {supabase} />
    <Alert />
  </Route>

  <Route path="/">
    <Home />
  </Route>
</Router>
<svelte:window />
<svelte:head>
  <title>Research Narratives</title>
</svelte:head>
