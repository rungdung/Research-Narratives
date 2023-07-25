import { loadSpatialData } from "./spatialRenderer.mjs";
import { loadPDFData } from "./nonSpatialRenderer.mjs";
import { loadToDB } from "./loadToDB.mjs";

// load last uploaded file
export async function loadData(files) {
  let currentIndex = files.accepted.length - 1;
  let file = files.accepted[currentIndex];
  let fileLocalUrl = URL.createObjectURL(file);
  let fileDBUrl = await loadToDB(file, file.name);

  const fileName = file.name.split(".")[0];
  const fileType = file.name.split(".")[1];
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
    // Handle different file types
    if (
      fileType.toLowerCase() === "geojson" ||
      fileType.toLowerCase() === "spatial"
    ) {
      loadSpatialData(null, fileName, fileDBUrl, appearanceExpression, DBload);
    } else if (fileType.toLowerCase() === "csv") {
      // Handle CSV file type
      // Perform actions specific to CSV files
      console.log("CSV file detected:", fileName);
    } else if (fileType.toLowerCase() === "pdf") {
      loadPDFData(fileLocalUrl, fileName, fileDBUrl);
    } else {
      alert("File type not supported");
    }
  } catch (error) {
    console.error("Error loading file:", error.message);
  }
}
