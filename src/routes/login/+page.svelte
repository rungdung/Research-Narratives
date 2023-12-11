<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeMinimal, ThemeSupa } from '@supabase/auth-ui-shared';
	import Nav from '$lib/Nav.svelte';

	export let data;
</script>

<!-- Set the title of the page -->
<svelte:head>
	<title>User Management</title>
</svelte:head>

<!-- Main section of the login/register page -->
<section class="max-w-screen-lg mx-auto">
	<!-- Include the navigation component -->
	<Nav />

	<div class="h-screen flex flex-col items-center justify-center p-10">
		<!-- Page title and description -->
		<h3 id="title">Login / Register</h3>
		<p class="text-black pb-4">
			Enter your email to receive a sign-in link. You will not require a password to sign in.
		</p>

		<!-- Authentication component for handling login/register functionality -->
		<div class="h-screen form-widget">
			<Auth
				supabaseClient={data.supabase}
				view="magic_link"
				redirectTo={`${data.url}`}
				showLinks={false}
				appearance={{
					theme: ThemeMinimal, // Use the Supabase theme for the Auth component
					style: { input: 'color: black' } // Apply custom styles, e.g., black text color
				}}
			/>
		</div>
	</div>
</section>

<!-- Custom styles for the page -->
<style>
	#title {
		color: black;
		font-size: 2em;
	}
</style>
