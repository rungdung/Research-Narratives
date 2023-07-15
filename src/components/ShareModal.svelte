<script>
  // Modal that will provide options for users to share their research map
  // with others

  import { markupNodes, uploadedSources, narrativeNodes } from "../stores";
  import { Modal, Button } from "flowbite-svelte";
  import { ShareNodesSolid, ShareAllSolid } from "flowbite-svelte-icons";
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
  <p>Use this link to access your research map</p>
  <input
    class="w-full text-gray-200 rounded-sm p-3 my-4 bg-inputField-50"
    bind:value={link}
  />

  <p class="mt-1">Use this link to access your rendered story</p>
  <input
    class="w-full text-gray-200 rounded-sm p-3 my-4 bg-inputField-50"
    value={"localhost:5173/RenderedStory?uuid=" + uuid}
  />
  <svelte:fragment slot="footer">
    <Button color="dark" href="/RenderedStory" target="_blank"
      >Open rendered story</Button
    >
  </svelte:fragment>
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
