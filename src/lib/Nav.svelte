<script>
	import { Navbar, NavBrand, NavLi, NavUl, NavHamburger } from 'flowbite-svelte';
	export let user;
</script>

<!-- 
  The Navbar component with custom styling for a transparent background, padding, and responsiveness.
-->
<Navbar class="bg-transparent pt-6 px-0 sm:px-0 h-fit" classNavDiv="mx-0 px-0 max-w-full">
	<NavBrand href="/">
		<div class=" ]	text-left md:mx-0 font-semibold text-yellow-500">
			<h2 class="text-3xl">Kaagada</h2>
		</div>
		
	</NavBrand>

	<!-- 
    The NavHamburger component for mobile navigation toggle.
  -->
	<NavHamburger />

	<!-- 
    The NavUl component containing the list of navigation links.
  -->
	<NavUl>
		<!-- Conditional rendering based on whether a user is authenticated -->
		{#if user}
			<!-- Static link to the "Libraries" page -->
			<NavLi href="/libraries">Libraries</NavLi>
			<!-- Display the user's name with a link to the account page if authenticated -->
			<NavLi href="/account">{user}</NavLi>
		{/if}
	</NavUl>
</Navbar>
