<script>
  // Modal that will provide options for users to share their research map
  // with others

  import {
    markupNodes,
    uploadedSources,
    narrativeNodes,
    annotationNodes,
  } from "../stores";
  import { Modal, Button } from "flowbite-svelte";
  import { ShareNodesSolid, ShareAllSolid } from "flowbite-svelte-icons";
  import { Link } from "svelte-routing";
  export let supabase;

  let shareDialog = false;
  let link;
  let entry;
  let buttonClicked = false;
  let uuid = self.crypto.randomUUID();

  async function handleSubmit() {
    entry = {
      uuid: uuid,
      created_at: new Date(), //current date
      sourceNodes: $uploadedSources,
      narrativeNodes: $narrativeNodes,
      annotationNodes: $annotationNodes,
      markupNodes: $markupNodes,
      publishedStory: null,
    };

    try {
      const { data, error } = await supabase.from("nodes_1").upsert(entry);
    } catch (error) {
      console.error("Error inserting data:", error.message);
    }
    try {
      link = "localhost:5173?uuid=" + entry.uuid;
    } catch (error) {
      console.error("Error getting link:", error.message);
    }
    shareDialog = true;
  }

  async function handleRenderClick() {
    await handleSubmit();
    buttonClicked = true;
    shareDialog = true;
    console.log($narrativeNodes);
  }
</script>

<Modal
  title="Sharing menu"
  bind:open={shareDialog}
  id="share-modal"
  color="primary"
  class="text-left light !bg-primary-50 !text-black !space-y-0"
  defaultClass="!space-y-0"
  autoclose
  outsideclose
>
  <p>Use this link to share your research map</p>
  <Link to="/demo/?uuid={uuid}">Research map</Link>

  <p class="mt-1">Use this link to share/view your rendered story</p>
  <Link to="/demo/RenderedStory?uuid={uuid}">Data Story</Link>
</Modal>

<Button
  color="dark"
  size="xs"
  class="px-2 py-1 rounded-md"
  on:click={handleSubmit}
>
  <ShareNodesSolid svgClass="dark mx-1" /> Share Map</Button
>
<Button
  color="dark"
  size="xs"
  class="px-2 py-1 rounded-md"
  on:click={handleRenderClick}
>
  <ShareAllSolid svgClass="dark mx-1" /> Render Data Story</Button
>
