<script>
    import { dialog } from "./FileRenderer.svelte";
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
    import { map } from "./Map.svelte";

    import { uploadedLayers } from "../stores";

    let fileToParse = {
        accepted: [],
        rejected: [],
    };

    function handleFilesSelect(e, files) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }

    function toggleLayer(layer) {
        if (layer["visible"]) {
            map.setLayoutProperty(layer['name'], "visibility", "visible");
        } else {
            map.setLayoutProperty(layer['name'], "visibility", "none");
        }
    }
</script>

<section id="layerControl">
{#if $uploadedLayers.length > 0}
        <ul>
            {#each $uploadedLayers as layer}
                <li>
                    <label>
                        <input
                            type="checkbox"
                            bind:checked={layer["visible"]}
                            on:change={() => toggleLayer(layer)}
                        />
                        {@html layer.name}
                    </label>
                </li>
            {/each}
        </ul>
{/if}

<button class="dropzoneAddSource bg-slate-800" on:click={() => dialog.showModal()}> Add data sources </button>
</section>

<style>
    :global(.dropzoneAddSource) {

        width: 100%;
        height: 3em;
        max-width: 100% !important;
    }
</style>
