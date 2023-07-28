import {
  loadSpatialData,
  fileConvert,
  loadGeoTiffData,
} from "./spatialRenderer.mjs";
import { loadPDFData } from "./nonSpatialRenderer.mjs";
import { loadToDB } from "./loadToDB.mjs";

// load last uploaded file
export async function loadData(files) {
  let currentIndex = files.accepted.length - 1;
  let file = files.accepted[currentIndex];
  let fileLocalUrl = URL.createObjectURL(file);

  const fileName = file.name.split(".")[0];
  let fileType = file.name.split(".")[1];
  console.log(fileName);
  if (fileType.toLowerCase() == "kml") {
    file = await fileConvert(file, fileName, fileType);
    fileType = "geojson";
  }
  console.log(file);
  let fileDBUrl = await loadToDB(file, fileName, fileType);

  renderData(fileName, fileType, fileLocalUrl, fileDBUrl, null, false);
}

// render files
export async function renderData(
  fileName,
  fileType,
  fileLocalUrl,
  fileDBUrl,
  appearanceExpression,
  DBload = false
) {
  try {
    if (DBload == true) {
      fileLocalUrl = fileDBUrl;
    }

    switch (fileType.toLowerCase()) {
      case "kml":
      case "geojson":
        loadSpatialData(
          null,
          fileName,
          fileDBUrl,
          fileType.toLowerCase(),
          appearanceExpression,
          DBload
        );
        break;
      case "tif":
      case "tiff":
      case "geotiff":
        loadGeoTiffData(fileName, fileDBUrl, DBload);
        break;
      case "csv":
        alert("CSVs are not supported yet");
        break;
      case "pdf":
        loadPDFData(fileLocalUrl, fileName, fileDBUrl);
        break;
    }
  } catch (error) {
    console.error("Error loading file:", error.message);
  }
}
