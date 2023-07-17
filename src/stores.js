import { writable } from "svelte/store";

// Nodes
export let markupNodes = writable([]);
export let uploadedSources = writable([]);
export let annotationNodes = writable([]);
export let narrativeNodes = writable([]);
export let connections = writable(new Set());

// Booleans for global triggers
export let fileUploadModal = writable(true);
