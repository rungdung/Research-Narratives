import { loadSpatialData } from "./spatialRenderer.mjs";

export async function loadDataFromDB(supabase) {
  //get the uuid from URL
  let queryString = window.location.search;
  let urlParams = new URLSearchParams(queryString);
  let uuid = urlParams.get("uuid");

  if (uuid) {
    const { data, error } = await supabase
      .from("nodes_1")
      .select("*")
      .eq("uuid", uuid)
      .single();
    console.log(data);
    loadSources(data.sourceNodes);
    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      return data;
    }
  } else {
    return null;
  }
}

async function loadSources(sources) {
  sources.forEach((source) => {
    loadSpatialData(null, source.name, source.dbURL, true);
  });
}
