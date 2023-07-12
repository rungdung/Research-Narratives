<script>
  import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
  import { onMount } from "svelte";

  import { Modal, Button } from "flowbite-svelte";
  import { FilePlusSolid, FileImportSolid } from "flowbite-svelte-icons";
  import { fileUploadModal } from "../stores";

  import { loadData } from "../utils/parentRenderer.mjs";
  import { loadLinkData } from "../utils/nonSpatialRenderer.mjs";
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
    loadData(files);
    $fileUploadModal = false;
  }

  onMount(() => {
    $fileUploadModal = true;
  });
</script>

<section id="fileViewPort" bind:this={fileViewPort} />

<Modal
  id="intro-file-drop"
  color="primary"
  class="!bg-primary-50 dark:bg-gray-800"
  bind:open={$fileUploadModal}
  size="md"
  title="Narrative Maker: easing research sharing"
  backdropClass="bg-gray-600 bg-opacity-70"
  defaultClass="!bg-primary-50"
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
  <svelte:fragment slot="footer">
    This is a alpha prototype. Please report any bugs <a
      href="https://github.com/rungdung/research-narratives-ui"
    >
      at this Github page</a
    >
  </svelte:fragment>
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
