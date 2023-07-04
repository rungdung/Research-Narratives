<script>
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import { onMount } from "svelte";

  import { loadSpatialData } from "../utils/spatialRenderer.mjs";
  import { loadPDFData, loadLinkData } from "../utils/nonSpatialRenderer.mjs";
  import { Modal, Button } from "flowbite-svelte";
  import { FilePlusSolid, FileImportSolid } from "flowbite-svelte-icons";
  import { fileUploadModal } from "../stores";

  let baseDB = {
      // file upload array
      accepted: [],
      rejected: [],
    },
    link;

  export let supabase;
  let fileViewPort; // Modal container

  // assign accepted files to baseDB
  function handleFilesSelect(e, files) {
    const { acceptedFiles, fileRejections } = e.detail;
    files.accepted = [...files.accepted, ...acceptedFiles];
    files.rejected = [...files.rejected, ...fileRejections];
    loadData();
    $fileUploadModal = false;
  }

  // load last uploaded file
  async function loadData() {
    let currentIndex = baseDB.accepted.length - 1;
    let file = baseDB.accepted[currentIndex];
    let fileLocalUrl = URL.createObjectURL(file);
    renderData(file, fileLocalUrl);
  }

  // render files
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
    $fileUploadModal = true;
  });
</script>

<section id="fileViewPort" bind:this={fileViewPort} />

<Modal
  id="intro-file-drop"
  class="bg-white dark:bg-gray-800"
  bind:open={$fileUploadModal}
  size="md"
  title="Narrative Maker: easing research sharing"
  backdropClass="bg-gray-600 bg-opacity-70"
  outsideclose
  autoclose
>
  <Dropzone
    on:drop={(e) => {
      handleFilesSelect(e, baseDB);
      baseDB = baseDB;
    }}
    multiple={false}
    containerClasses="dropzoneMain !align-middle !p-10 !text-gray-600 !py-auto"
    containerStyles="rounded-md "
  >
    <FilePlusSolid svgClass="dark" class="w-10 h-10" />
    {#if baseDB.accepted.length > 0}
      <p>Last upload: {baseDB.accepted[baseDB.accepted.length - 1].name}</p>
    {:else}
      Upload a GeoJSON file or a PDF to start with.
    {/if}
  </Dropzone>
  <section id="link-upload">
    <input
      class="rounded-md text-black p-1 bg-white"
      placeholder="Paste a link to access"
      bind:value={link}
    />

    <Button
      color="dark"
      size="sm"
      class="rounded-md mx-auto"
      on:click={() => {
        loadLinkData(link, fileViewPort);
        $fileUploadModal = false;
      }}>Load from link</Button
    >
  </section>
</Modal>

<style>
  #link-upload {
    display: flex;
    width: 100%;
    height: 3em;
    margin: 0.5em 0em;
  }
  #link-upload input {
    min-width: 70%;
    border: 2px dashed #bfbfbf;
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
    border-radius: 5px;
    background-color: antiquewhite !important;

    text-align: left;
    color: black;
  }

  :global(.maplibregl-popup-content) {
    background-color: transparent;
    box-shadow: none;
  }

  :global(.dropzoneMain) {
    height: 10em !important;
    width: 100%;
    margin: 1em 0em;
    max-width: 100% !important;
    text-align: center;
  }
</style>
