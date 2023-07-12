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
  try {
    localStorage.setItem("uploadedSources", JSON.stringify(value));
  } catch (error) {
    if (error.name === "QuotaExceededError")
      alert(
        "The file has too many attributes. You may face performance or rendering errors. Please reduce the number of attributes."
      );
  }
});
narrativeNodes.subscribe((value) => {
  localStorage.setItem("narrativeNodes", JSON.stringify(value));
});
annotationNodes.subscribe((value) => {
  localStorage.setItem("annotationNodes", JSON.stringify(value));
});

// Booleans for global triggers
export let fileUploadModal = writable(true);
export let mapLoadStatus = writable(false);
