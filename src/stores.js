import { writable } from "svelte/store";

export let markupNodes = writable([]);
export let uploadedSources = writable([]);
export let annotationNodes = writable([]);

let localNarrativeNodes;
try {
  localNarrativeNodes = JSON.parse(localStorage.getItem("narrativeNodes"));
} catch (error) {
  console.log(error);
}
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
