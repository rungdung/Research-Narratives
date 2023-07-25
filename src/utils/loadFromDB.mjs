import { renderData } from "./parentRenderer.mjs";

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

    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      return data;
    }
  } else {
    return null;
  }
}

export async function loadSources(sources) {
  sources.forEach((source) => {
    // renderData(fileName, fileType, fileLocalUrl, fileDBUrl, expression for appearance, DBload: is it loading from DB or local upload)
    renderData(source.fileName, source.type, null, source.dbURL, null, true);
  });
}
