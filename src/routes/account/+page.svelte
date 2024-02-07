<!-- src/routes/account/+page.svelte -->
<script lang="ts">
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import Nav from '$lib/Nav.svelte';
	import { Input, Label } from 'flowbite-svelte';

	export let data;
	export let form;

	// Destructure data object and reactivity statement
	let { session, supabase, profile } = data;
	$: ({ session, supabase, profile } = data);

	// Initialize component variables
	let profileForm: HTMLFormElement;
	let loading = false;
	let fullName: string = profile?.full_name ?? '';
	let username: string = profile?.username ?? '';

	// Define form submission handlers
	const handleSubmit: SubmitFunction = () => {
		loading = true;
		return async () => {
			loading = false;
		};
	};

	const handleSignOut: SubmitFunction = () => {
		loading = true;
		return async ({ update }) => {
			loading = false;
			update();
		};
	};
</script>

<section class="max-w-screen-lg mx-auto">
	<!-- Include navigation component with the user's full name -->
	<Nav user={fullName} />

	<!-- Page title -->
	<h3 id="title">Edit account details</h3>

	<!-- Main content section -->
	<div class="h-screen flex flex-col items-center p-5">
		<!-- Form widget containing profile update and sign-out forms -->
		<div class="form-widget">
			<!-- Profile update form -->
			<form
				class="form-widget grid gap-y-5"
				method="post"
				action="?/update"
				use:enhance={handleSubmit}
				bind:this={profileForm}
			>
				<!-- Email input (disabled) -->
				<div>
					<Label for="email">Email</Label>
					<Input id="email" type="text" value={session.user.email} disabled />
				</div>

				<!-- Full Name input -->
				<div>
					<Label for="fullName">Full Name</Label>
					<Input id="fullName" name="fullName" type="text" value={form?.fullName ?? fullName} />
				</div>

				<!-- Username input -->
				<div>
					<Label for="username">Username</Label>
					<Input id="username" name="username" type="text" value={form?.username ?? username} />
				</div>

				<!-- Submit button -->
				<div>
					<button class="button bg-black block mt-2" disabled={loading} type="submit" on:click={() => profileForm.requestSubmit()}>Update</button>
				</div>
			</form>

			<!-- Sign-out form -->
			<form method="post" action="?/signout" use:enhance={handleSignOut}>
				<div>
					<!-- Sign-out button -->
					<button class="button block mt-2" disabled={loading}>Sign Out</button>
				</div>
			</form>
		</div>
	</div>
</section>

<style>
	/* Styling for the page title and form widget */
	#title {
		color: black;
		font-size: 2em;
	}
	.form-widget {
		color: black;
		min-width: 40vw;
	}
</style>
