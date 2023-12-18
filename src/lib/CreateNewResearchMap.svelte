<!-- src/routes/libraries/view/CreateNewResearchMap.svelte -->
<script>
	import { Modal, Label, Input, Button } from 'flowbite-svelte';
	import { Dropdown, DropdownItem, Checkbox, Search } from 'flowbite-svelte';
	import { enhance } from '$app/forms';

	// External props for controlling the modal and passing resource data
	export let newResearchMapModal;

	// Local state for form and resource index
	let createNewForm;
</script>

<!-- Modal for editing resource -->
<Modal bind:open={newResearchMapModal} size="xs" autoclose={true} outsideclose class="w-full">
	<!-- Form for updating resource information -->
	<form
		class="form-widget grid gap-y-5"
		method="post"
		action="?/createResearchMap"
		bind:this={createNewForm}
		use:enhance
	>
		<Label for="title">Title</Label>
		<Input id="title" name="title" type="text" />

		<Label for="description">Description</Label>
		<Input id="description" name="description" type="text" />

		<!-- Button for triggering form submission -->
		<div>
			<Button color="dark" on:click={() => createNewForm.requestSubmit()}>Update</Button>
		</div>
	</form>
</Modal>
