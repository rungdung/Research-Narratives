import { writable } from "svelte/store";
import FileUploadModal from "./components/FileUploadModal.svelte";

export let markupNodes = writable([]);
export let uploadedSources = writable([]);
export let annotationNodes = writable([]);
let localNarrativeNodes = JSON.parse(localStorage.getItem("narrativeNodes"));
export let narrativeNodes = writable(
  localNarrativeNodes ? localNarrativeNodes : []
);

markupNodes.subscribe((value) => {
  localStorage.setItem("markupNodes", JSON.stringify(value));
});
uploadedSources.subscribe((value) => {
  localStorage.setItem("uploadedSources", JSON.stringify(value));
});
narrativeNodes.subscribe((value) => {
  localStorage.setItem("narrativeNodes", JSON.stringify(value));
});
annotationNodes.subscribe((value) => {
  localStorage.setItem("annotationNodes", JSON.stringify(value));
});

export let fileUploadModal = writable(true);
