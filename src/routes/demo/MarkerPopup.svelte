<script>
	import { DataHandler, Datatable, Th, ThFilter } from '@vincjo/datatables'; //https://vincjo.fr/datatables/
	import { Button } from 'flowbite-svelte';
	import { addNewMarkupNode } from '$lib/utils/addNewNodes.mjs';

	import Alert from '../../lib/Alerts.svelte';

	export let feature; //import from UploadData.svelte

	// map the data to key value pairs for the table
	let data = Object.entries(feature.properties).map(([key, value]) => {
		return {
			key: key,
			value: value
		};
	});
	// Create a new data handler for the table
	const handler = new DataHandler(data, { rowsPerPage: 5 });
	const rows = handler.getRows();

	function createAlert() {
		new Alert({
			target: document.body,
			props: {
				pos: 'right',
				content: 'Feature added to research map'
			}
		});
	}
</script>

<article class="popup">
	<Datatable {handler}>
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

	<Button
		class="bg-slate-700"
		size="xs"
		id="addToList"
		on:click={() => {
			addNewMarkupNode(feature);
			createAlert();
		}}
	>
		Add to research map
	</Button>
</article>

<style global>
	.popup {
		padding: 2em;
		border-radius: 5px;
		background-color: rgb(247, 240, 230);
		width: 300px;
		color: black;
		max-height: 40vh;
		overflow: scroll;
		text-align: left;
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
	}

	:global(.maplibregl-popup-tip) {
		border-top-color: rgb(172, 142, 104) !important;
	}
</style>
