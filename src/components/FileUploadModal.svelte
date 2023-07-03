<script context="module">
  export let dialog;
</script>

<script>
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import { onMount } from "svelte";

  import { loadSpatialData } from "../utils/spatialRenderer.mjs";
  import { loadPDFData, loadLinkData } from "../utils/nonSpatialRenderer.mjs";

  export let supabase;
  // file upload array
  let baseDB = {
      accepted: [],
      rejected: [],
    },
    link;

  let fileViewPort;

  // assign accepted files to baseDB
  function handleFilesSelect(e, files) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
  }

  async function loadData() {
    let currentIndex = baseDB.accepted.length - 1;
    let file = baseDB.accepted[currentIndex];
    let fileLocalUrl = URL.createObjectURL(file);
    renderData(file, fileLocalUrl);
  }

  async function renderData(file, fileLocalUrl) {
    try {
      const fileName = file.name.split(".")[0];
      const fileType = file.name.split(".")[1];

      // Handle different file types
      if (fileType.toLowerCase() === "geojson") {
        loadSpatialData(fileLocalUrl, fileName);
      } else if (fileType.toLowerCase() === "csv") {
        // Handle CSV file type
        // Perform actions specific to CSV files
        console.log("CSV file detected:", fileName);
      } else if (fileType.toLowerCase() === "pdf") {
        loadPDFData(fileLocalUrl, fileName, fileViewPort);
      } else {
        alert("File type not supported");
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }

    // Upload file to Supabase storage
    try {
      const { data, error } = await supabase.storage
        .from("researchNarratives")
        .upload("public/" + file.name, file);

      const fileUrl = supabase.storage
        .from("researchNarratives")
        .getPublicUrl("public/" + file.name);
      console.log(fileUrl.data.publicUrl);
      if (error.message != "The resource already exists") {
        console.error("Error uploading file:", error.message);
        return;
      }
    } catch (error) {
      console.error("Error uploading file:", error.message);
    }
  }

  onMount(() => {
    dialog.showModal();
  });
</script>

<section id="fileViewPort" bind:this={fileViewPort} />

<dialog id="intro-file-drop" class="" bind:this={dialog}>
  <h1>Eli5'ing research sharing</h1>
  <h3>Upload a PDF or a geojson file. You can even enter a link as a source</h3>
  <Dropzone
    on:drop={(e) => {
      handleFilesSelect(e, baseDB);
      baseDB = baseDB;
    }}
    multiple={false}
    containerClasses="dropzoneMain"
    containerStyles="rounded-md text-black p-1 w-40 bg-slate-700"
  >
    {#if baseDB.accepted.length > 0}
      <p>{baseDB.accepted[baseDB.accepted.length - 1].name}</p>
    {:else}
      Drag and drop or click to open a GeoJSON file.
    {/if}
  </Dropzone>
  <section id="link-upload">
    <input
      class="rounded-md text-white p-1 bg-slate-700"
      placeholder="Paste a link to access"
      bind:value={link}
    />

    <button
      class="rounded-md"
      on:click={() => {
        loadLinkData(link, fileViewPort);
        dialog.close();
      }}>Load from link</button
    >
  </section>

  <button class="rounded-md" on:click={() => dialog.close()}>Close</button>
  <button
    class="rounded-md"
    on:click={() => {
      loadData();
      dialog.close();
    }}>Load on map</button
  >
</dialog>

<style>
  #link-upload {
    display: flex;
    width: 100%;
    margin: 1em 0em;
  }
  #link-upload input {
    min-width: 80%;
  }
  #fileViewPort {
    display: none;
    position: absolute;
    top: 3em;
    left: 25em;
    z-index: 5;
    width: 30em !important;
    height: 40em !important;
  }
  :global(#intro-file-drop) {
    border: 2px dashed #007cbf;
    background-color: antiquewhite;
    opacity: 1;
    border-radius: 5px;
    padding: 3em;
    text-align: left;
    color: black;
  }

  :global(.maplibregl-popup-content) {
    background-color: transparent;
    box-shadow: none;
  }

  #intro-file-drop::backdrop {
    background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
    animation: fade-in 1s;
  }
  :global(.dropzoneMain) {
    height: 10em !important;
    width: 100%;
    margin: 1em 0em;
    max-width: 100% !important;
    text-align: center;
  }

  @keyframes fade-in {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
</style>
