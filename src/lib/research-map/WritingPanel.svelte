<script lang="ts">
	import { Card, Textarea, Input, Button, Label, CloseButton } from 'flowbite-svelte';
	import { ArrowUpRightFromSquareOutline } from 'flowbite-svelte-icons';

	import { enhance } from '$app/forms';
	import { page } from '$app/stores';

	import WritingNode from './WritingNode.svelte';
	import WritingNodeMaximised from './WritingNodeMaximised.svelte';

	// Local instance of narrative sections
	export let data;
	export let narrativeSections;
	export let title;
	export let description;

	let narrativeSectionsJSON;
	$: narrativeSections = narrativeSections;
	$: narrativeSectionsJSON = JSON.stringify(narrativeSections);

	// Maximise the entire writing panel
	let maximise = false;

	// new section
	let newSection = {
		title: '',
		bodytext: '',
		displayObj: {
			title: ''
		}
	};

	// append new section
	async function createNewSection() {
		if (narrativeSections == null) {
			narrativeSections = [];
		}

		newSection = {
			title: '',
			bodytext: '',
			displayObj: {
				title: ''
			}
		};

		narrativeSections = [...narrativeSections, newSection];
	}
</script>

<div class="text-black h-full overflow-y-auto py-3">
	{#if maximise}
		<div
			class="z-50 bg-primary-50 bg-opacity-90 fixed top-0 left-0 w-screen h-screen grid grid-cols-1 mx-auto max-w-none transition duration-500 overflow-scroll snap-proximity snap-y"
		>
			<CloseButton
				on:click={() => (maximise = false)}
				class="absolute z-50 right-0 top-0 m-10 bg-slate-600"
			/>
			<div class="overflow-y-auto snap-y">
				<div class="h-screen snap-center">
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
				<div class="my-5 snap-center mx-auto gap-2 h-20 grid grid-cols-2 w-[30vw]">
					<Button color="dark" class="" on:click={createNewSection}>Add section</Button>
					<Button
						color="dark"
						href="/libraries/narratives/view?narrative_id={$page.url.searchParams.get('map_id')}"
						>Share the narrative</Button
					>
				</div>
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

		<div class="grid grid-flow-row-dense gap-2 my-5 grid-cols-1">
			{#if narrativeSections}
				{#each narrativeSections as section}
					<WritingNode bind:section />
				{/each}
			{/if}
			<Button color="dark" size="sm" on:click={createNewSection}>Add section</Button>
		</div>
	{/if}
</div>
