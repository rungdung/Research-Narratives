<!-- src/routes/libraries/view/EditResource.svelte -->
<script>
	import { Modal, Label, Input, Button } from 'flowbite-svelte';
	import { enhance } from '$app/forms';

	// External props for controlling the modal and passing resource data
	export let editModal;
	export let resources;
	export let resourceId;

	// Local state for form and resource index
	export let createNewForm;

	// Index of resource in resources object
	const index = resources.files.findIndex((resource) => resource.id === resourceId);

	console.log(index, resources);

	// Convert resources object to JSON for form submission
	$: resourcesJSON = JSON.stringify(resources);
</script>

<!-- Modal for editing resource -->
<Modal bind:open={editModal} size="xs" autoclose={true} outsideclose class="w-full">
	<!-- Form for updating resource information -->
	<form
		class="form-widget grid gap-y-5"
		method="post"
		action="?/updateResource"
		bind:this={createNewForm}
		use:enhance
	>
		<!-- Hidden input for submitting JSON representation of resources -->
		<input type="hidden" id="resources" name="resources" bind:value={resourcesJSON} />

		<!-- Input fields for editing resource attributes -->
		<Label for="source">Source</Label>
		<Input id="source" name="source" type="text" bind:value={resources.files[index].source} />

		<Label for="title">Title</Label>
		<Input id="title" name="title" type="text" bind:value={resources.files[index].title} />

		<Label for="description">Description</Label>
		<Input
			id="description"
			name="description"
			type="text"
			bind:value={resources.files[index].description}
		/>

		<!-- Button for triggering form submission -->
		<div>
			<Button color="dark" on:click={() => createNewForm.requestSubmit()}>Update</Button>
		</div>
	</form>
</Modal>
