<script lang="ts">
	import { Card, Textarea, Input } from 'flowbite-svelte';
	import { Button } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
	import WritingNodes from './WritingNodes.svelte';

	// Local instance of narrative sections
	export let narrativeSections;
	$: narrativeSections = narrativeSections;
	let narrativeSectionsJSON = JSON.stringify(narrativeSections);
	$: narrativeSectionsJSON = JSON.stringify(narrativeSections);

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
			bodytext: ''
		};

		setTimeout(() => {
			createNewForm.requestSubmit();
		}, 100);
	}
</script>

<div class="text-black h-full py-3">
	<h3 class="text-2xl">Writing panel</h3>
	<p>You can write here</p>
	<div class="grid grid-flow-row-dense gap-2 my-5 grid-cols-1 h-5/6 overflow-y-scroll">
		{#if narrativeSections}
			{#each narrativeSections as section}
				<WritingNodes bind:section />
			{/each}
		{/if}
		<Card class="node text-black bg-slate-700">
			<form
				class="form-widget grid gap-y-2"
				method="post"
				action="?/updateNarrativeSection"
				bind:this={createNewForm}
				use:enhance
			>
				<Input
					type="text"
					bind:value={newSection.title}
					placeholder="What is the title of this section"
				/>
				<Textarea
					type="text"
					bind:value={newSection.bodytext}
					placeholder="What is the body of this section"
				/>

				<input
					type="hidden"
					id="narrative-sections"
					name="narrative-sections"
					bind:value={narrativeSectionsJSON}
				/>
				<Button size="xs" color="dark" on:click={handleSubmit}>Add section</Button>
			</form>
		</Card>
	</div>
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
