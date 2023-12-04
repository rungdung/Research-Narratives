<script>
	import { Node, Anchor, generateOutput, generateInput } from 'svelvet';
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'; //https://vincjo.fr/datatables/
	import { AccordionItem, Accordion, Button, Label, Input } from 'flowbite-svelte';
	import { map } from '../Map.svelte';
	import { zoomToFeature } from '$lib/utils/mapMovements.mjs';
	import { markupNodes, uploadedSources } from '../../../stores';
	import DataSourceDrawer from './DataSourceDrawer.svelte';
	import CustomAnchor from './customAnchor.svelte';
	import AnimatedEdge from './customAnimatedEdge.svelte';

	export let markupNode;
	let position;
	let handler, rows;

	// Make a deep copy of data for Svelvet. Because Svelvet seems to overwrite data.
	let dataConnectionsCopy = JSON.parse(JSON.stringify(markupNode.dataConnections));

	// Differentiate UI elements for different node types
	if (markupNode.type == 'singular') {
		// map the data to key value pairs for the table
		let data = Object.entries(markupNode.properties).map(([key, value]) => {
			return {
				key: key,
				value: value
			};
		});
		// Create a new data handler for the table
		handler = new DataHandler(data, { rowsPerPage: 5 });
		rows = handler.getRows();
	}

	// Data transfer
	let inputs = generateInput({
		mapFeature: markupNode.feature,
		filterExpression: markupNode.filterExpression,
		targetLayer: markupNode.targetLayer,
		source: markupNode.source
	});

	const processor = ($inputs) => {
		return $inputs;
	};

	const output = generateOutput(inputs, processor);

	// Update position of node in store
	function updatePosition() {
		markupNodes.update((nodes) => {
			let index = nodes.findIndex((node) => node.id == markupNode.id);
			nodes[index].position = position;
			return nodes;
		});
	}

	function deleteNode() {
		markupNodes.update((nodes) => {
			let index = nodes.findIndex((node) => node.id == markupNode.id);
			nodes.splice(index, 1);
			return nodes;
		});
	}
</script>

<Node
	{...markupNode}
	id={markupNode.id}
	let:grabHandle
	bind:position
	on:nodeClicked={updatePosition}
>
	<div class="node" use:grabHandle>
		<section class="node-wrapper container mx-3 my-3">
			<h2 class="text-2xl text-white whitespace-normal">
				{markupNode.label}
			</h2>
			<Label class="space-y-1">
				<span class="text-gray-200">Name of feature(s)</span>
				<Input
					type="text"
					placeholder="Small input"
					size="sm"
					class="bg-inputField-200"
					bind:value={markupNode.label}
				/>
			</Label>

			<Accordion flush class="my-2 group-first:rounded-t-md">
				<AccordionItem paddingFlush={'p-2'}>
					<span slot="header" class="text-white">Notes</span>
					<textarea
						class="text-gray-500 body my-1 py-1 w-full rounded-md bg-inputField-200"
						value={markupNode.notes}
						placeholder="Enter notes"
					/>
				</AccordionItem>
				{#if markupNode.type == 'singular'}
					<AccordionItem paddingFlush={'p-2'}>
						<span slot="header" class="text-white">Table of properties</span>
						<section>
							<Datatable {handler} class="text-gray-300">
								<table>
									<thead>
										<Th {handler} orderBy="key">Key</Th>
										<Th {handler} orderBy="value">Value</Th>
									</thead>
									<tbody>
										{#each $rows as row}
											<tr>
												<td>{@html row.key}</td>
												<td>{@html row.value}</td>
											</tr>
										{/each}
									</tbody>
								</table>
							</Datatable>
						</section>
					</AccordionItem>
				{/if}
			</Accordion>
			<button
				on:click={() => {
					zoomToFeature(markupNode.feature, map);
				}}
				class="bg-slate-800"
			>
				Open Source document / Feature
			</button>
			<section id="meta-menu" class="mt-3">
				<Button
					size="xs"
					class="px-1 py-0 m-0 rounded-sm"
					on:click={() => {
						new DataSourceDrawer({
							target: document.body,
							props: {
								sourceNode: $uploadedSources.find((source) => source.fileName == markupNode.source),
								hiddenBool: false
							}
						});
					}}>info</Button
				>
				<Button
					size="xs"
					class="px-1 py-0 m-0 rounded-sm"
					on:click={() => {
						deleteNode();
					}}>delete this</Button
				>
			</section>
		</section>
		<span class="anchor-left">
			<Anchor let:linked let:connecting let:hovering>
				<CustomAnchor {hovering} {connecting} {linked} label="" />
			</Anchor>
		</span>
		<span class="anchor-right">
			<Anchor
				id="data"
				edge={AnimatedEdge}
				let:linked
				let:connecting
				let:hovering
				outputStore={output}
				key="narrativeData"
				connections={dataConnectionsCopy}
				output
			>
				<CustomAnchor {hovering} {connecting} {linked} label="data" color="red-500" />
			</Anchor>
		</span>
	</div>
</Node>

<style>
	.anchor,
	.anchor-top,
	.anchor-right,
	.anchor-left {
		position: absolute;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}

	.anchor {
		bottom: -10%;
		left: 50%;
	}

	.anchor-top {
		top: -10%;
		left: 50%;
	}
	.anchor-right {
		top: 50%;
		right: -10%;
	}
	.anchor-left {
		top: 50%;
		left: -10%;
	}

	.node-wrapper {
		margin: 1em;
		width: 90%;
	}

	.node {
		width: 100%;
		height: 100%;
		min-width: 3em;
		max-width: 25em;
		background-color: #5e6b6a;
		border-radius: 8px;
		border: 3px solid black;
	}
</style>
