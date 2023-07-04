<script>
  import { DataHandler, Datatable, Th, ThFilter } from "@vincjo/datatables"; //https://vincjo.fr/datatables/
  import { markupNodes } from "../stores.js";

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

  async function addToList() {
    // Add to selected features store
    markupNodes.update((features) => {
      // Convert all the keys to lower case before passing to MarkerPopup.svelte
      let props = Object.fromEntries(
        Object.entries(feature.properties).map(([key, val]) => [
          key.toLowerCase(),
          val,
        ])
      );

      // Assign unique sequential id
      props["id"] = features.length + 1;
      props["label"] =
        props["title"] ||
        props["name"] ||
        props["id"] ||
        "No title field available";
      props["feature"] = feature;
      props["notes"] = "";
      props["source"] = feature.layer.source;
      props["files"] = {
        accepted: [],
        rejected: [],
      };
      props["properties"] = feature.properties;

      features.push(props);
      return features;
    });

    $markupNodes = $markupNodes;
  }
</script>

<article class="popup">
  <Datatable {handler}>
    <table>
      <thead>
        <Th {handler} orderBy="key">Key</Th>
        <Th {handler} orderBy="value">Value</Th>
      </thead>
      <tbody>
        {#each $rows as row}
          <tr>
            <td>{@html row.key}</td>
            <td>{@html row.value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  </Datatable>

  <button class="bg-slate-700" id="addToList" on:click={() => addToList()}>
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
