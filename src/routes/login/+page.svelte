<!-- src/routes/login/+page.svelte -->
<script lang="ts">
	import { Auth } from '@supabase/auth-ui-svelte';
	import { ThemeMinimal, ThemeSupa } from '@supabase/auth-ui-shared';
	import Nav from '$lib/Nav.svelte';

	export let data;
</script>

<!-- Set the title of the page -->
<svelte:head>
	<title>Kaagada: Login</title>
</svelte:head>

<!-- Main section of the login/register page -->
<section class="max-w-screen-lg mx-auto h-screen">
	<!-- Include the navigation component -->
	<Nav />

	<section class="w-1/4 mx-auto py-10">
		<!-- Page title and description -->
		<h3 class="text-yellow-500 text-3xl">Login / Register</h3>
		<p class="text-yellow-500 pb-4">
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
					style: {
						input: 'color: black; padding: 10px 20px; border-radius: 5px; border: 1px solid #ccc;',
						label: 'color: black',
						button:
							'background-color: #efb49a; color: black; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;'
					} // Apply custom styles, e.g., black text color
				}}
			/>
		</div>
	</section>
</section>
