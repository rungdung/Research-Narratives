<script>
  import { map } from "./Map.svelte";
  import { uploadedSources, fileUploadModal } from "../stores";
  import PDFobject from "pdfobject";

  async function toggleLayer(layer) {
    if (layer["visible"]) {
      if (layer["type"] == "Spatial") {
        map.setLayoutProperty(layer["name"], "visibility", "visible");
      } else if (layer["type"] == "PDF") {
        // Open in new popup tab
        window.open(layer.blob, "_blank");
        // layer.container.style.display = "block";
        // await PDFobject.embed(layer.blob, layer.container);
      } else if (layer["type"] == "Link") {
        // Open in new popup tab
        window.open(layer.blob, "_blank");
        // layer.container.style.display = "block";
        // layer.container.innerHTML = `<iframe src="${layer.blob}" width="100%" height="100%"></iframe>`;
      }
    } else {
      console.log(layer["type"]);
      if (layer["type"] == "Spatial") {
        map.setLayoutProperty(layer["name"], "visibility", "none");
      } else if (layer["type"] == "PDF" || layer["type"] == "Link") {
        // // destroy the iframe
        // layer.container.innerHTML = "";
        // // set display css property to none
        // layer.container.style.display = "none";
      }
    }
  }
</script>

<section id="layerControl">
  <section id="layerList">
    {#if $uploadedSources.length > 0}
      <ul>
        {#each $uploadedSources as layer}
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
    on:click={() => {
      $fileUploadModal = true;
    }}
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
