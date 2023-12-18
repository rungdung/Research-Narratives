<!-- src/routes/libraries/CreateNewLib.svelte -->
<script>
	import { enhance } from '$app/forms';
	import { Card, Label, Input } from 'flowbite-svelte';

	// Declare variables for new library information
	let newLibraryName = '';
	let newLibraryDescription = '';

	// Reference to the form element
	let createNewForm;

	// Loading state for the submit button
	let loading = false;

	// External input for custom text (default to an empty string if not provided)
	export let text;
</script>

<!-- Card component for creating a new library -->
<Card class="bg-primary-100 drop-shadow-md opacity-80">
	<!-- Display custom text if provided -->
	{text ?? ''}

	<!-- Form for creating a new library -->
	<form
		class="form-widget grid gap-y-5"
		method="post"
		action="?/createLibrary"
		use:enhance
		bind:this={createNewForm}
	>
		<!-- Input field for library name -->
		<div>
			<Label for="name">Name</Label>
			<Input id="name" name="name" type="text" value={newLibraryName} />
		</div>

		<!-- Input field for library description -->
		<div>
			<Label for="description">Description</Label>
			<Input id="description" name="description" type="text" value={newLibraryDescription} />
		</div>

		<!-- Submit button for creating a new library -->
		<div>
			<Input
				type="submit"
				class="button block primary"
				value={loading ? 'Loading...' : 'Create a new library'}
				disabled={loading}
			/>
		</div>
	</form>
</Card>
