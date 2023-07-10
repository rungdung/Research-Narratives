import { writable } from "svelte/store";

// Nodes
export let markupNodes = writable([]);
export let uploadedSources = writable([]);
export let annotationNodes = writable([]);
export let narrativeNodes = writable([]);

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

// Booleans for global triggers
export let fileUploadModal = writable(true);
