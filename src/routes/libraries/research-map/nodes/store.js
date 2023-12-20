import { writable } from 'svelte/store';

export let activeDraggableNode = writable(null);
export let activeDraggableNodeModal = writable(false);
