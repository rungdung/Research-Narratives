<!-- src/routes/libraries/view/UploadNew.svelte -->
<script lang="ts">
	import type { SupabaseClient } from '@supabase/supabase-js';
	import { invalidate } from '$app/navigation';
	import { enhance } from '$app/forms';
	import { Card, Label, Input, Modal, Button, CloseButton } from 'flowbite-svelte';

	export let supabase: SupabaseClient;

	// Local state and form references
	let urlField: HTMLInputElement;
	let uploading = false;
	let createNewForm: HTMLFormElement;
	let files: FileList;
	let attributes, attributesJSON;

	// External prop for controlling modal visibility
	export let formModal = false;

	// Function to upload a new resource
	const uploadResource = async () => {
		try {
			uploading = true;

			// Check if files are selected
			if (!files || files.length === 0) {
				throw new Error('You must select an image/pdf/video/geojson/gpkj to upload.');
			}

			// Get the first file and its extension
			const file = files[0];
			// read file
			const fileExt = file.name.split('.').pop();

			// Get attributes if it is spatial file
			if (fileExt == 'geojson') {
				let data = await parseJsonFile(file);
				attributes = await getAttributes(data);
			}
			const filePath = `${Math.random()}.${fileExt}`;

			// Upload the file to Supabase storage
			const { error } = await supabase.storage.from('resources').upload(filePath, file);

			// Handle errors during upload
			if (error) {
				throw error;
			}

			// Set the file path in the form and submit the form
			urlField.value = filePath;
			createNewForm.requestSubmit();
			formModal = false;
		} catch (error) {
			// Show an alert for any errors
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			// Reset the uploading state and invalidate the cache
			uploading = false;
			invalidate(() => true);
		}
	};

	// read file
	async function parseJsonFile(file) {
		return new Promise((resolve, reject) => {
			const fileReader = new FileReader();
			fileReader.onload = (event) => resolve(JSON.parse(event.target.result));
			fileReader.onerror = (error) => reject(error);
			fileReader.readAsText(file);
		});
	}

	// Get attributes
	const getAttributes = (file) => {
		// Get Keys and unique values of the key if categorical assign data type
		// if continuous, get range
		try {
			attributes = Object.entries(file.features[0].properties).map(([key, value]) => {
				let dataType;
				let range, numericValues;
				let uniqueValues = new Set();

				// Check for datatypes
				if (typeof value == 'number') {
					dataType = 'numeric';
					numericValues = file.features.map((feature) => feature.properties[key]);
					range = [
						Math.round(Math.min(...numericValues) * 10) / 10,
						Math.round(Math.max(...numericValues) * 10) / 10
					];
				} else if (typeof value == 'string') {
					dataType = 'string';
					file.features.map((feature) => {
						uniqueValues.add(feature.properties[key]);
					});
				} else if (typeof value == 'boolean') {
					dataType = 'boolean';
				}

				return {
					name: key,
					dataType: dataType,
					range: range,
					numericValues: numericValues,
					values: Array.from(uniqueValues)
				};
			});
			return attributes;
		} catch (error) {
			console.log(error);
		}
	};

	$: attributesJSON = JSON.stringify(attributes);
</script>

<!-- Modal for uploading a new resource -->
<Modal bind:open={formModal} size="xs" autoclose={true} outsideclose class="w-full">
	<!-- Form for uploading a new resource -->
	<form
		class="form-widget grid gap-y-5"
		method="post"
		action="?/createResource"
		bind:this={createNewForm}
		use:enhance
	>
		<!-- Hidden input for storing the file path -->
		<input type="hidden" id="url" name="url" bind:this={urlField} />

		<!-- Input fields for resource attributes -->
		<Label for="source">Source</Label>
		<Input id="source" name="source" type="text" />

		<Label for="title">Title</Label>
		<Input id="title" name="title" type="text" />

		<Label for="description">Description</Label>
		<Input id="description" name="description" type="text" />

		<Input id="attributes" name="attributes" type="hidden" bind:value={attributesJSON} />

		<!-- Upload button and file input -->
		<div>
			<Label class="button primary block" for="single">
				{uploading ? 'Uploading ...' : 'Upload'}
			</Label>

			<input
				style=""
				type="file"
				id="single"
				accept="image/*,application/pdf,video/*,.geojson,.gpkg,.gpx"
				name="file"
				bind:files
				on:change={uploadResource}
				disabled={uploading}
			/>
		</div>
	</form>
</Modal>
