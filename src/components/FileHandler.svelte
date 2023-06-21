<script>
    import { dialog } from "./FileRenderer.svelte";
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
    import { map } from "./Map.svelte";

    import { uploadedLayers } from "../stores";

    import PDFobject from "pdfobject";

    let fileToParse = {
        accepted: [],
        rejected: [],
    };

    function handleFilesSelect(e, files) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }

    async function toggleLayer(layer) {
        if (layer["visible"]) {
            if (layer['type'] == "Spatial") {
                console.log(layer["name"])
                map.setLayoutProperty(layer["name"], "visibility", "visible");
            } else if (layer['type'] == "PDF") {
                console.log('adding')
                await PDFobject.embed(layer.blob, layer.container);
            } else if (layer['type'] == "Link") {
                layer.container.innerHTML = `<iframe src="${layer.blob}" width="100%" height="100%"></iframe>`;
            }
        } else {
            console.log(layer["type"])
            if (layer['type'] == "Spatial"){
                map.setLayoutProperty(layer["name"], "visibility", "none");
            } else if (layer['type'] == "PDF" || layer['type'] == "Link") {
                // destroy the iframe
                layer.container.innerHTML = "" ;
                // set click events to null
                layer.container.onclick = null;
                console.log(layer.container.innerHTML)
            }
            
        }
    }
</script>

<section id="layerControl">
    <section id="layerList">
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
    </section>

    <button
        class="dropzoneAddSource bg-slate-800"
        on:click={() => dialog.showModal()}
    >
        Add data sources
    </button>
</section>

<style>
    #layerList {
        height: 10em;
        overflow-y: scroll;
    }
    :global(.dropzoneAddSource) {
        width: 100%;
        height: 3em;
        max-width: 100% !important;
    }
</style>
