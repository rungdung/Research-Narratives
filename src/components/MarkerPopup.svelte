<script>
  import { DataHandler, Datatable, Th, ThFilter } from "@vincjo/datatables"; //https://vincjo.fr/datatables/
  import { addNewMarkupNode } from "../utils/addNewNodes.mjs";
  import sanitizeHtml from "sanitize-html";
  export let feature; //import from UploadData.svelte

  // map the data to key value pairs for the table
  let data = Object.entries(feature.properties).map(([key, value]) => {
    return {
      key: key,
      value: value,
    };
  });
  // Create a new data handler for the table
  const handler = new DataHandler(data, { rowsPerPage: 5 });
  const rows = handler.getRows();

  const sanitizerProps = {
    allowedTags: ["img"],
    allowedAttributes: {
      img: ["src", "alt"],
    },
  };
</script>

<article class="popup">
  <!--
    KML images support
  -->
  {#if typeof feature.properties.gx_media_links === "string"}
    <img
      src={feature.properties.gx_media_links}
      alt={feature.properties.gx_media_links}
    />
  {/if}
  <Datatable {handler}>
    <table>
      <thead>
        <Th {handler} orderBy="key">Key</Th>
        <Th {handler} orderBy="value">Value</Th>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>{sanitizeHtml(row.key, sanitizerProps)}</td>
            <td>{sanitizeHtml(row.value, sanitizerProps)}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Datatable>

  <button
    class="bg-slate-700"
    id="addToList"
    on:click={() => addNewMarkupNode(feature)}
  >
    Add to research map
  </button>
</article>

<style global>
  .popup {
    padding: 2em;
    border-radius: 5px;
    background-color: rgb(247, 240, 230);
    width: 300px;
    color: black;
    max-height: 40vh;
    overflow: scroll;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  }

  :global(.maplibregl-popup-tip) {
    border-top-color: rgb(172, 142, 104) !important;
  }
  .popup h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  .popup button {
    margin-top: 10px;
    padding: 5px;
    border-radius: 5px;
    color: #fff;
  }
</style>
