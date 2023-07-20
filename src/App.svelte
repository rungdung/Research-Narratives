<script>
  import { loadDataFromDB } from "./utils/loadFromDB.mjs";
  import { uploadedSources, markupNodes, narrativeNodes } from "./stores";

  import { onMount } from "svelte";

  import { Route, Router } from "svelte-routing";
  import Template from "./components/routes/Template.svelte";
  import Main from "./components/routes/Main.svelte";

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
    <Main {supabase} />
    <Alert />
  </Route>
</Router>
<svelte:window />
<svelte:head>
  <title>Research Narratives</title>
</svelte:head>
