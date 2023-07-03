import { writable } from "svelte/store";
import { loadDataFromDB } from "./utils/loadFromDB.mjs";

const storedMarkupNodes = localStorage.getItem("markupNodes");
const storedUploadedSources = localStorage.getItem("uploadedSources");
const storedNarrativeNodes = localStorage.getItem("narrativeNodes");

export let markupNodes = writable(
  storedMarkupNodes ? JSON.parse(storedMarkupNodes) : []
);
export let uploadedSources = writable(
  storedUploadedSources ? JSON.parse(storedUploadedSources) : []
);
export let narrativeNodes = writable(
  storedNarrativeNodes ? JSON.parse(storedNarrativeNodes) : []
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
