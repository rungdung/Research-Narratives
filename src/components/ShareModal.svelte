<script type="module">
  // Modal that will provide options for users to share their research map
  // with others
  import { markupNodes, uploadedSources, narrativeNodes } from "../stores";

  export let supabase;

  let shareDialog;
  let link;
  let entry;

  async function handleSubmit() {
    entry = {
      uuid: self.crypto.randomUUID(),
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
  }
</script>

<dialog id="share-modal" bind:this={shareDialog}>
  <p>Use this link to access your research map</p>
  <input bind:value={link} />
</dialog>

<button
  on:click={() => {
    handleSubmit();
    shareDialog.showModal();
  }}
>
  Share Map
</button>

<style>
  #share-modal {
  }
</style>
