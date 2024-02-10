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
