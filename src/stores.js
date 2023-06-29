import { writable } from "svelte/store";
import { loadDataFromDB } from "./utils/loadFromDB.mjs";
// // Nodes
// const retrieved = localStorage.getItem("storedFeatures");
// const parsed = JSON.parse(retrieved);

// markupNodes.subscribe((value) => {
//   localStorage.setItem("storedFeatures", JSON.stringify(value));
// });

export const markupNodes = writable([]);
export const uploadedSources = writable([]);
export const narrativeNodes = writable([]);
