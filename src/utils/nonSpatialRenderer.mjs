import PDFobject from "pdfobject";
import { uploadedSources } from "../stores";
import { loadSpatialData } from "./spatialRenderer.mjs";

export async function loadPDFData(file, fileName, fileViewPort) {
  try {
    // Open in new popup tab
    //window.open(file.blob, "_blank");
    // fileViewPort.style.display = "block";
    // await PDFobject.embed(file, fileViewPort);
    uploadedSources.update((sources) => {
      sources.push({
        name: fileName,
        type: "PDF",
        geometry: "NA",
        blob: file,
        visible: false,
        container: fileViewPort,
      });
      return sources;
    });
  } catch (error) {
    alert(error);
  }
}

export async function loadLinkData(link, fileViewPort) {
  let file = link;
  let fileName = link.split("/").pop().split(".")[0];
  let fileType = link.split("/").pop().split(".")[1];
  if (fileType) {
    if (fileType.toLowerCase() == "geojson") {
      loadSpatialData(file, fileName);
    } else if (fileType.toLowerCase() == "csv") {
    } else if (fileType.toLowerCase() == "pdf") {
      loadPDFData(file, fileName);
    }
  } else {
    // Open in new popup tab
    //window.open(file.blob, "_blank");
    // fileViewPort.style.display = "block";
    // // insert as iframe if not supported;
    // fileViewPort.innerHTML = `<iframe src="${file}" width="100%" height="100%"></iframe>`;
    uploadedSources.update((sources) => {
      sources.push({
        name: fileName,
        type: "Link",
        geometry: "NA",
        blob: file,
        visible: false,
        container: fileViewPort,
      });
      return sources;
    });
  }
}
