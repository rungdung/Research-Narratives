import { loadSpatialData } from "./spatialRenderer.mjs";
import { loadPDFData } from "./nonSpatialRenderer.mjs";
import { loadToDB } from "./loadToDB.mjs";

// load last uploaded file
export async function loadData(files) {
  let currentIndex = files.accepted.length - 1;
  let file = files.accepted[currentIndex];
  let fileLocalUrl = URL.createObjectURL(file);
  let fileDBUrl = await loadToDB(file, file.name);
  console.log(fileDBUrl);
  renderData(file, fileLocalUrl, fileDBUrl);
}

// render files
export async function renderData(file, fileLocalUrl, fileDBUrl) {
  try {
    const fileName = file.name.split(".")[0];
    const fileType = file.name.split(".")[1];

    // Handle different file types
    if (fileType.toLowerCase() === "geojson") {
      loadSpatialData(fileLocalUrl, fileName, fileDBUrl);
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
