<!-- src/routes/libraries/view/EditResource.svelte -->
<script>
	import { Modal, Label, Input, Button } from 'flowbite-svelte';
	import { PenSolid } from 'flowbite-svelte-icons';
	import { enhance } from '$app/forms';

	// External props for controlling the modal and passing resource data
	let editModal;
	export let resource;

	// Local state for form and resource index
	export let createNewForm;
</script>

<Button
	size="xs"
	class="text-white px-2 absolute right-0 py-0 mx-5 rounded-none"
	color="transparent"
	on:click={() => (editModal = true)}
>
	<PenSolid color="black" />
</Button>

<!-- Modal for editing resource -->
<Modal
	bind:open={editModal}
	size="xs"
	autoclose={true}
	outsideclose
	class="w-full absolute text-black top-0 left-0 z-50 translate-x-[-50%] translate-y-[-50%] bg-primary-100 opacity-100"
>
	<!-- Form for updating resource information -->
	<form
		class="form-widget grid gap-y-1"
		method="post"
		action="?/updateResource"
		bind:this={createNewForm}
		use:enhance
	>
		<!-- Input fields for editing resource attributes -->
		<Label for="source">Source</Label>
		<Input id="source" name="source" type="text" bind:value={resource.source} />

		<Label for="title">Title</Label>
		<Input id="title" name="title" type="text" bind:value={resource.title} />

		<Label for="description">Description</Label>
		<Input id="description" name="description" type="text" bind:value={resource.description} />

		<Input id="id" name="id" type="hidden" bind:value={resource.id} />
		<!-- Button for triggering form submission -->
		<Button color="dark" class="mt-2" on:click={() => createNewForm.requestSubmit()}>Update</Button>
	</form>
</Modal>
