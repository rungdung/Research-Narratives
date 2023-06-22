import { writable } from "svelte/store";

// Nodes
const retrieved = localStorage.getItem("storedFeatures");
const parsed = JSON.parse(retrieved);
export const selectedFeatures = writable(parsed === null ? [] : parsed);

selectedFeatures.subscribe((value) => {
  localStorage.setItem("storedFeatures", JSON.stringify(value));
});

export const uploadedSources = writable([]);
export const narrativeNodes = writable([]);
