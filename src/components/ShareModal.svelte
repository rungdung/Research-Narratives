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

  function handleRenderClick() {
    buttonClicked = true;
    shareDialog = true;
    console.log($narrativeNodes);
  }
</script>

<Modal
  title="Sharing menu"
  bind:open={shareDialog}
  id="share-modal"
  autoclose
  outsideclose
>
  {#if link}
    <p>Use this link to access your research map</p>
    <input class="w-100" bind:value={link} />
  {/if}
  {#if buttonClicked}
    <Button color="dark"
      ><a href="/RenderedStory" target="_blank">Open rendered story</a></Button
    >
  {/if}
</Modal>

<Button outline color="dark" on:click={handleSubmit}>
  <ShareNodesSolid svgClass="dark mx-1" /> Share Map</Button
>
<Button outline color="dark" class="text-black" on:click={handleRenderClick}>
  <ShareAllSolid svgClass="dark mx-1" /> Render Data Story</Button
>
