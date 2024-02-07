<script>
	import { Label, Input, Helper, Button, Card, CloseButton } from 'flowbite-svelte';
	import { UserCircleSolid } from 'flowbite-svelte-icons';

	import { enhance } from '$app/forms';

	export let contributors;
	let formModal = false;
	let form;
</script>

<div class="inline-flex gap-x-1 items-center">
	{#each contributors.slice(0, 3) as profile}
		<UserCircleSolid class="text-gray-500" />
	{/each}
	{#if contributors.length > 0}
		...
	{/if}

	<Button color="light" class="pl-2 align-middle" on:click={() => (formModal = !formModal)}>Add User</Button>
</div>

{#if formModal}
	<Card class="bg-primary-100 absolute min-w-[15vw] max-w-[15vw] origin-top-right z-50 bg-opacity-100 drop-shadow-md">
		<CloseButton class="absolute top-0 right-0 p-2" on:click={() => (formModal = false)} />
			{#if contributors.length > 0}
			<small class="text-xs mb-3 break-words">
				{#each contributors as profile}
				{profile.full_name},&nbsp;
				{/each}
				have access to this library
			</small>
			{/if}
		<form action="?/addContributor" method="post" use:enhance bind:this={form}>
			<div class="mb-6">
				<Label for="email" class="mb-2">Add a contributor to this library</Label>
				<Input id="email" name="email" type="email" required />
				<Helper class="text-xs mt-2 text-gray-500">If such an account does not exist already, they will get an invitation email.</Helper>
			</div>
		</form>
		<Button type="submit" on:click={form.requestSubmit()} color="dark">Invite</Button>
	</Card>
{/if}
