<script lang="ts">
	import { Card, Textarea, Input } from 'flowbite-svelte';
	import { Button, Label, CloseButton } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	import WritingNode from './WritingNode.svelte';
	import WritingNodeMaximised from './WritingNodeMaximised.svelte';

	// Local instance of narrative sections
	export let narrativeSections;
	export let title;
	export let description;

	let narrativeSectionsJSON;
	$: narrativeSections = narrativeSections;
	$: narrativeSectionsJSON = JSON.stringify(narrativeSections);

	// Maximise the entire writing panel
	let maximise = false;

	// Let preview
	let preview;

	// formBinding
	let createNewForm;

	// new section
	let newSection = {
		title: '',
		bodytext: ''
	};

	// append new section
	async function handleSubmit() {
		if (narrativeSections == null) {
			narrativeSections = [];
		}
		narrativeSections = [...narrativeSections, newSection];

		newSection = {
			title: '',
			bodytext: '',
			displayObj: {
				title: ''
			}
		};

		setTimeout(() => {
			createNewForm.requestSubmit();
		}, 100);
	}
</script>

<div class="text-black h-full py-3">
	{#if maximise}
		<div
			class="z-50 bg-primary-50 bg-opacity-90 fixed top-0 left-0 w-screen h-screen grid grid-cols-1 mx-auto max-w-none transition duration-500"
		>
			<CloseButton
				on:click={() => (maximise = false)}
				class="absolute right-0 top-0 m-10 bg-slate-600"
			/>
			<div class="overflow-y-auto">
				<div class="h-screen">
					<div class="transform w-1/2 translate-x-1/2 translate-y-96 text-left">
						<h3 class="text-4xl">
							{title}
						</h3>
						<p>{description}</p>
					</div>
				</div>
				{#if narrativeSections}
					{#each narrativeSections as section}
						<WritingNodeMaximised {section} />
					{/each}
				{/if}

				<Button on:click={() => (narrativeSections = [...narrativeSections, newSection])}
					>Add section</Button
				>
			</div>
		</div>
	{:else}
		<h3 class="text-2xl">
			{title}
			<Button class="p-1 " on:click={() => (maximise = true)}
				><ArrowUpRightFromSquareOutline class="w-5 h-5" /></Button
			>
		</h3>
		<p>You can write here</p>
		<div class="bg-secondary-100 w-full object-right" />

		<div class="grid grid-flow-row-dense gap-2 my-5 grid-cols-1 h-5/6 overflow-y-scroll">
			{#if narrativeSections}
				{#each narrativeSections as section}
					<WritingNode bind:section />
				{/each}
			{/if}
			<Button on:click={() => (narrativeSections = [...narrativeSections, newSection])}
				>Add section</Button
			>
		</div>
	{/if}
</div>

<style>
	.node {
		color: black;
		font-weight: 700;
		border-radius: 3px;
		cursor: grab;
		width: auto;
		height: fit-content;
	}
</style>
