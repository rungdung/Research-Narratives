<script>
	import { Navbar, NavBrand, Button } from 'flowbite-svelte';

	import { GithubSolid } from 'flowbite-svelte-icons';

	let sequence = [
		{
			id: 'spatial-whiteboarding',
			text: 'What if spatial data and media could be explored on a whiteboard?',
			visual: './assets/researchMap.webm'
		},
		{
			id: 'filtering',
			text: 'Visualise your spatial data with filters and Choropleths',
			visual: './assets/spatialFeatures.webm'
		},
		{
			id: 'rendered-stories',
			text: 'Convert your mindmaps into interactive data stories',
			visual: './assets/renderedStory.webm'
		},
		{
			id: 'collaboration',
			text: 'When you share your story, your mindmap is shared alongside, contextualise to a new level'
		}
	];

	let sampleStories = [
		{
			title: "Bengaluru's Land-Use Change Trends",
			description:
				"..., the data from 2007-2019 showcases how 'Hi-Tech' a land use introduced specially in the 2007 master plan to promote IT industries has become the new location for residential and commercial real estate in the city. ",
			image: './assets/landuse-bengaluru-sample-thumbnail.jpg',
			researchMapLink: '.demo/?uuid=1cc66182-ccf3-469d-9c59-befc13e43f5b',
			link: './demo/RenderedStory?uuid=1cc66182-ccf3-469d-9c59-befc13e43f5b'
		},
		{
			title: 'Geographical Patterns of Child Malnutrition in Karnataka',
			description:
				"Even after making decades of progress, India is still home to a major fraction of the world's malnourished children. Malnutrition in early childhood is associated with lower cognitive and physical ability, and can have a lifelong impact...",
			image: './assets/stunting-karnataka-sample-thumbnail.jpg',
			researchMapLink: './demo/?uuid=4e0aeb83-702e-4403-868a-ff081622229d',
			link: './demo/RenderedStory?uuid=4e0aeb83-702e-4403-868a-ff081622229d'
		},
		{
			title: 'Try out the proof of concept',
			description:
				'You can upload your own data and create your own stories. The tool is in its alpha stages, so please bear with us. We are looking for contributors to help us build this tool. If you are interested, please reach out to us at...',
			image: './assets/empty-home-sample-thumbnail.jpg',
			researchMapLink: '',
			link: './demo/',
			type: 'demo'
		}
	];
</script>

<section class="bg-primary-50 text-black px-2 sm:px-10 md:w-3/4 md:mx-auto">
	<Navbar
		let:hidden
		let:toggle
		class="bg-transparent py-20 justify-center w-full "
		navDivClass="items-center p-0"
	>
		<NavBrand href="/" class="justify-center w-full">
			<h1 class="text-5xl sm:w-1/3 md:w-1/2 text-center md:mx-0 font-semibold text-yellow-500">Kaagada</h1>
			<br />
		</NavBrand>
		<p class="text-[0.8rem] mx-auto mt-5 align-baseline text-center text-yellow-500 w-[40vw] ">
			[Kaa-ga-da](noun) meaning 'Paper' in Kannada, sharing roots with many Indo and Dravidian
			languages
		</p>
		<p class="py-6 px-12 text-yellow-500 text-justify">
			<br /><br />
			Kaagada, previously Research Narratives, emerged from a vision to promote responsible data use
			in research and communication. It's a collaborative tool for multidisciplinary writing or research
			projects that convey data patterns.
			<span class="underline text-yellow-600">
				Kaagada is undergoing a major rewrite and can be used at <a
					href="https://rewrite.kaagada.urbaninformaticslab.in" class="text-yellow-800">rewrite.kaagada.urbaninformaticslab.in</a
				>. Some features in this proof of concept are not available in the redevelopment version yet.
			</span>
		</p>

		<!-- small menu -->

		<!-- <NavHamburger on:click={toggle} />
      <NavUl
        {hidden}
        activeClass=""
        divClass="sm:w-1/2 text-left w-full md:block p-0"
      >
        <NavLi id="nav-menu1" class="cursor-pointer"
          ><Chevron aligned>Possibilities</Chevron></NavLi
        >
        <Dropdown
          triggeredBy="#nav-menu1"
          class="w-100 z-20 bg-yellow-500 rounded-md"
        >
          <DropdownItem href="/#filtering" class="text-white hover:text-black"
            >Spatial Data exploration</DropdownItem
          >
          <DropdownItem
            href="/#spatial-whiteboarding"
            class="text-white hover:text-black">Mindmapping data</DropdownItem
          >
          <DropdownItem href="/#collaboration" class="text-white hover:text-black"
            >Share and collaborate</DropdownItem
          >
          <DropdownItem
            href="/#rendered-stories"
            class="text-white hover:text-black">Create datastories</DropdownItem
          >
        </Dropdown>
        <NavLi href="#roadmap">Going forward</NavLi>
        <NavLi href="#demo">Alpha</NavLi>
        <NavLi href="#links">Contact</NavLi>
      </NavUl> -->
	</Navbar>

	<section class="grid grid-cols-1 sm:grid-cols-2 gap-12">
		{#each sequence as { id, text, visual }}
			<div class="py-6 px-4">
				<h2 class="text-2xl md:w-full font-semibold mb-4 text-left leading-tight">
					{@html text}
				</h2>
			</div>

			{#if visual}
				<div class="shadow-md mx-auto">
					<video class="h-auto rounded-lg" autoplay muted loop>
						<source src={visual} type="video/webm" />
					</video>
				</div>
			{/if}
		{/each}
	</section>

	<section id="trial" class="text-left mx-3">
		<h2 id="demo" class="text-4xl text-center py-10">Some sample stories...</h2>
		<p class="text-center">Please use a desktop to view these stories.</p>
		<section
			class="grid grid-flow-row grid-cols-1 w-full mx-auto sm:grid-cols-3 sm:mx-0 sm:w-full md:mx-auto my-10"
		>
			{#each sampleStories as { title, description, image, researchMapLink, link, type }}
				<div
					class="card-container flex flex-col justify-between p-4 bg-primary-100 shadow-md rounded-md mx-2 my-2"
				>
					<img class="w-full h-60 object-cover rounded-t-md" src={image} alt="Card thumbnail" />
					<div class="p-4 sm:px-1">
						<h2 class="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
						<p class="text-gray-600">{description}</p>
					</div>
					<div class="flex justify-start p-4 sm:px-1">
						{#if type == 'demo'}
							<Button
								class="bg-primary-500 text-white py-1 px-2 rounded hover:bg-primary-600 transition duration-300"
								data-umami-event="demo-open"
								href={link}
								on:click={(e) => {
									e.preventDefault();
									window.open(link, '_blank');
								}}
							>
								Try out the tool (Desktop only)
							</Button>
						{:else}
							<div class="flex justify-between gap-3 items-start">
								<Button
									class="bg-primary-500 text-white py-1 px-2 rounded hover:bg-primary-600 transition duration-300"
									data-umami-event="open-sample-data-story"
									href={link}
									on:click={(e) => {
										e.preventDefault();
										window.open(link, '_blank');
									}}
								>
									View Data Story (Desktop only)
								</Button>

								<Button
									class="bg-primary-500 text-white py-1 px-2 rounded hover:bg-primary-600 transition duration-300"
									data-umami-event="open-sample-raw-mindmap"
									href={researchMapLink}
									on:click={(e) => {
										e.preventDefault();
										window.open(researchMapLink, '_blank');
									}}
								>
									View Raw Mind Map (Desktop only)
								</Button>
							</div>
						{/if}
					</div>
				</div>
			{/each}
		</section>
	</section>
</section>

<footer class="bg-transparent text-black text-[0.8rem] text-left p-10 sm:p-40 grid grid-cols-1 sm:grid-cols-2">
	<div>
		This project was developed during an internship with the Urban Informatics Lab, Indian Institute
		of Human Settlements, Bengaluru.

		<br /> <br />If you align with our vision or can dedicate time and effort, please connect with
		us on
		<a href="https://github.com/rungdung/research-narratives" target="_blank">GitHub Issues.</a>

		<br />
	</div>
	<div id="links" class="py-2 sm:py-0 sm:text-right">
		Email at adhavan[dot]sivaraj16[at]gmail[dot]com
		
		<section id="roadmap" class=" py-5">
			<Button
				href="https://github.com/rungdung/research-narratives"
				class="bg-gray-900 text-white py-2 px-4 rounded-lg  hover:bg-gray-300 hover:text-black transition duration-300"
			>
				<GithubSolid class="w-10 h-10 mr-2" svgClass="color:white" />
				Issues? We're on Github
			</Button>
		</section> 
	</div>
</footer>

<style>
	:global(html) {
		scroll-behavior: smooth;
	}
</style>
