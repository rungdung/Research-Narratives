<script>
	import { Navbar, NavBrand, Button } from 'flowbite-svelte';

	import { GithubSolid } from 'flowbite-svelte-icons';
</script>

<section id="hero" class="bg-primary-50 flex h-screen text-black px-2 sm:px-10 md:w-3/4 md:mx-auto">
	<Navbar let:hidden let:toggle class="bg-transparent py-20 w-full my-auto" navDivClass="p-0">
		<NavBrand href="/" class="w-full">
			<h1 class="text-5xl sm:w-1/3 md:mx-0 font-semibold text-yellow-500">Kaagada</h1>
			<br />
		</NavBrand>
		<p class="pt-1 text-yellow-500">[Kaa-ga-da]<i class="italic">(noun)</i></p>
		<p class="pt-1 text-yellow-500">
			meaning 'Paper' in Kannada, sharing roots with many Indo-Aryan and Dravidian languages
		</p>
		<p class="py-6 text-yellow-500 w-2/4">
			Write, annotate, draw and share, all in one place. Kaagadha emerged from a vision to promote
			responsible data use in research and communication. It's a collaborative tool for
			multidisciplinary writing or research projects that convey data patterns.
		</p>
		<Button href="/login" class="bg-primary-300" size="lg">Demo</Button>
		<p class="text-yellow-500 text-xs w-1/4 pt-3">
			Development in progress at <a href="https://github.com/rungdung/research-narratives">Github</a
			> This project is under active development and welcomes contributors.
		</p>
	</Navbar>
</section>

<footer
	class="bg-transparent text-yellow-900 text-left py-40 px-2 sm:px-10 md:w-3/4 md:mx-auto grid grid-cols-1 sm:grid-cols-2"
>
	<div>
		This project was developed during an internship with the <a
			class="text-yellow-500"
			href="https://www.iihs.ac.in/"
		>
			Urban Informatics Lab, Indian Institute of Human Settlements, Bengaluru.
		</a>
		<br />
	</div>
	<div id="links" class="py-2 sm:py-0 sm:text-right">
		Email at adhavan[dot]sivaraj16[at]gmail[dot]com
		<div id="roadmap" class="py-5">
			<Button
				href="https://github.com/rungdung/research-narratives"
				class="bg-gray-900 text-white py-2 px-2 rounded-lg  hover:bg-gray-300 hover:text-black transition duration-300"
			>
				<GithubSolid class="w-10 h-10 mr-2" svgClass="color:white" />
				We are on Github
			</Button>
		</div>
	</div>
</footer>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
