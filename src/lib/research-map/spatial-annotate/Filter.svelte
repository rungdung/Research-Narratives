<script>
	import { Select, Label, Button, Dropdown, Search } from 'flowbite-svelte';
	import RangeSlider from 'svelte-range-slider-pips';
	import { getAttributes } from './utils/attributes';

	export let resourceJSON;
	export let map;
	export let filterExpression;

	let attributes;
	
	$: if (resourceJSON ) {
		attributes = getAttributes(resourceJSON)
	}		

	// Variables for filter operations
	let selectedAttribute,
		selectedAttributeValue,
		selectedAttributeRange = [0, 1],
		step;

	let layerName = 'resource-layer';

	// Number formatter for the slider
	const num = new Intl.NumberFormat('en-IN');

	// Function to perform attribute-based search
	async function search() {
		filterExpression = ['all', ['==', ['get', selectedAttribute.name], selectedAttributeValue]];
		map.setFilter(layerName, filterExpression);
	}

	// Function to clear all applied filters
	async function clearAllFilters() {
		map.setFilter(layerName, null);
	}

	// Function to perform range-based search
	async function searchRange() {
		filterExpression = [
			'all',
			['>=', ['get', selectedAttribute.name], selectedAttributeRange[0]],
			['<=', ['get', selectedAttribute.name], selectedAttributeRange[1]]
		];

		try {
			map.setFilter(layerName, filterExpression);
		} catch (error) {
			console.log(error);
		}
	}

	// Calculate step for the range slider
	$: step = (selectedAttributeRange[1] - selectedAttributeRange[0]) / 10;
</script>

<!-- Dropdown to select an attribute -->
{#if attributes}
	<Label for="attribute-select">Select an attribute</Label>
	<Select id="attribute-select" size="sm" class="p-0 px-1 my-1" bind:value={selectedAttribute}>
		{#each attributes as attribute}
			<option value={attribute}>
				<span class="text-3xs">{attribute.dataType}</span>
				{attribute.name}
			</option>
		{/each}
	</Select>
{/if}

<!-- Dropdown to select a value for string attributes -->
{#if selectedAttribute && selectedAttribute.dataType === 'string'}
	<Label for="value-select">Select a value</Label>
	<Select id="value-select" size="sm" class="p-0 px-1" bind:value={selectedAttributeValue}>
		{#each attributes as attribute}
			{#if attribute.name === selectedAttribute.name}
				{#each attribute.values as value}
					<option {value}>{value}</option>
				{/each}
			{/if}
		{/each}
	</Select>
	<Button on:click={search} class="rounded-sm px-1 py-0 mt-2 bg-slate-800" id="search-button">
		Filter
	</Button>
{/if}

<!-- Range slider for numeric attributes -->
{#if selectedAttribute && selectedAttribute.dataType === 'numeric'}
	<Label for="value-select">Select a value</Label>
	{#if selectedAttribute.range[0] !== selectedAttribute.range[1]}
		<RangeSlider
			id="value-select"
			bind:values={selectedAttributeRange}
			min={selectedAttribute.range[0]}
			max={selectedAttribute.range[1]}
			formatter={(v) => num.format(v)}
			range={true}
			pushy={true}
			float={true}
			pips={true}
			first="label"
			last="label"
			{step}
		/>
		<Button
			on:click={searchRange}
			class="rounded-sm px-1 py-0 mt-2 bg-slate-800"
			id="search-button"
		>
			Filter
		</Button>
	{:else}
		<p class="text-sm text-black">No range to filter or range too small</p>
	{/if}
{/if}

<!-- Button to clear all filters -->
<Button on:click={clearAllFilters} class="rounded-sm px-1 py-0 mt-2 bg-slate-800">
	Clear all filters
</Button>

<style>
	:global(.rangeSlider) {
		font-size: 0.7rem !important;
	}
</style>
