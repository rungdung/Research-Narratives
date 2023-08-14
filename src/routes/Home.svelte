<script>
  import {
    Navbar,
    NavBrand,
    NavLi,
    NavUl,
    NavHamburger,
    Dropdown,
    DropdownItem,
    Chevron,
    DropdownDivider,
    Card,
    Button,
  } from "flowbite-svelte";

  import { fly } from "svelte/transition";
  let sequence = [
    {
      id: "spatial-whiteboarding",
      text: "What if spatial data and media could be explored on a whiteboard?",
      visual: "./assets/researchMap.webm",
    },
    {
      id: "filtering",
      text: "Visualise your spatial data with filters and Choropleths",
      visual: "./assets/spatialFeatures.webm",
    },
    {
      id: "rendered-stories",
      text: "Convert your mindmaps into interactive data stories",
      visual: "./assets/RenderedStory.webm",
    },
    {
      id: "collaboration",
      text: "When you share your story, your mindmap is shared alongside, contextualise to a new level",
    },
  ];

  let sampleStories = [
    {
      title: "Bengaluru's Land-Use Change Trends",
      description:
        "..., the data from 2007-2019 showcases how 'Hi-Tech' a land use introduced specially in the 2007 master plan to promote IT industries has become the new location for residential and commercial real estate in the city. ",
      image: "./assets/landuse-bengaluru-sample-thumbnail.jpg",
      researchMapLink: "./demo/?uuid=4be2d2ce-8431-48d4-8ae7-c1a56177e98c",
      link: "./demo/RenderedStory?uuid=4be2d2ce-8431-48d4-8ae7-c1a56177e98c",
    },
    {
      title: "Geographical Patterns of Child Malnutrition in Karnataka",
      description:
        "Even after making decades of progress, India is still home to a major fraction of the world's malnourished children. Malnutrition in early childhood is associated with lower cognitive and physical ability, and can have a lifelong impact...",
      image: "./assets/stunting-karnataka-sample-thumbnail.jpg",
      researchMapLink: "./demo/?uuid=4e0aeb83-702e-4403-868a-ff081622229d",
      link: "./demo/RenderedStory?uuid=4e0aeb83-702e-4403-868a-ff081622229d",
    },
    {
      title: "Try out the proof of concept",
      description:
        "You can upload your own data and create your own stories. The tool is in its alpha stages, so please bear with us. We are looking for contributors to help us build this tool. If you are interested, please reach out to us at...",
      image: "./assets/empty-home-sample-thumbnail.jpg",
      researchMapLink: "",
      link: "./demo/",
      type: "demo",
    },
  ];
</script>

<section class="bg-primary-50 text-black ">
  <Navbar
    let:hidden
    let:toggle
    class="bg-transparent   py-12"
    navDivClass="items-center p-0"
  >
    <NavBrand href="/">
      <h1
        class="text-5xl w-1/3 text-center md:mx-0 md:text-left font-semibold text-yellow-500"
      >
        Research Narratives
      </h1>
      <br />
    </NavBrand>
    <p class="text-left md:w-1/3 w-full py-3 text-yellow-500">
      A visual interface for multi-media and spatial data annotation. 
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

  <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
    {#each sequence as { id, text, visual }}
      <div class="py-6 px-4">
        <h2 class="text-2xl font-semibold mb-4 text-left max-w-md leading-tight">{@html text}</h2>
      </div>
  
      {#if visual}
        <div class="shadow-md mx-auto">
          <video class="w-full h-auto object-cover rounded-lg" autoplay muted loop>
            <source src={visual} type="video/webm" />
          </video>
        </div>
      {/if}
    {/each}
  </div>
  
  <section id="trial" class="text-left mx-3">
    <h2 id="demo" class="text-4xl text-center py-10">See what you can do</h2>
    <section
      class="grid grid-flow-row grid-cols-1 w-full mx-auto sm:grid-cols-3 sm:mx-0 sm:w-full md:w-5/6 md:mx-auto my-10"
    >
      {#each sampleStories as { title, description, image, researchMapLink, link, type }}
      <div class="card-container flex flex-col justify-between p-4 bg-primary-100 shadow-md rounded-md mx-2 my-2">
        <img class="w-full h-60 object-cover rounded-t-md" src={image} alt="Card Image" />
        <div class="p-4">
          <h2 class="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
          <p class="text-gray-600">{description}</p>
        </div>
        <div class="flex justify-start p-4">
          {#if type == "demo"}
            <a href={link}>
              <button
                class="bg-primary-500 text-white py-1 px-2 rounded hover:bg-primary-600 transition duration-300"
                
                data-umami-event="demo-open"
              >
                Try out the tool
              </button>
            </a>
          {:else}
            <div class="flex justify-between gap-3 items-start">
              <a  href={link}>
                <button
                  class="bg-primary-500 text-white py-1 px-2 rounded hover:bg-primary-600 transition duration-300"
                 
                  data-umami-event="open-sample-data-story"
                >
                  View Data Story
                </button>
              </a>
              <a   href={researchMapLink}>
                <button
                  class="bg-primary-500 text-white py-1 px-2 rounded hover:bg-primary-600 transition duration-300"
                
                  data-umami-event="open-sample-raw-mindmap"
                >
                  View Raw Mind Map
                </button>
              </a>
            </div>
          {/if}
        </div>
      </div>
      
      {/each}
    </section>
  </section>

  <section id="roadmap" class="px-5">
    <a  href="https://github.com/rungdung/research-narratives" target="_blank" >
      <button type="button" class="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-lg px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 mr-2 mb-2">
        <svg class="w-10 h-10 mr-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 .333A9.911 9.911 0 0 0 6.866 19.65c.5.092.678-.215.678-.477 0-.237-.01-1.017-.014-1.845-2.757.6-3.338-1.169-3.338-1.169a2.627 2.627 0 0 0-1.1-1.451c-.9-.615.07-.6.07-.6a2.084 2.084 0 0 1 1.518 1.021 2.11 2.11 0 0 0 2.884.823c.044-.503.268-.973.63-1.325-2.2-.25-4.516-1.1-4.516-4.9A3.832 3.832 0 0 1 4.7 7.068a3.56 3.56 0 0 1 .095-2.623s.832-.266 2.726 1.016a9.409 9.409 0 0 1 4.962 0c1.89-1.282 2.717-1.016 2.717-1.016.366.83.402 1.768.1 2.623a3.827 3.827 0 0 1 1.02 2.659c0 3.807-2.319 4.644-4.525 4.889a2.366 2.366 0 0 1 .673 1.834c0 1.326-.012 2.394-.012 2.72 0 .263.18.572.681.475A9.911 9.911 0 0 0 10 .333Z" clip-rule="evenodd"/>
        </svg>
        Issues? We're on Github
      </button>
    </a>
  </section>
</section>

<footer
  class=" bg-transparent text-black text-left py-40 flex md:flex-row flex-col justify-between items-start"
>
  <div>
<p class="max-w-xl">This project was developed during an internship with the Urban Informatics Lab, Indian Institute of Human Settlements, Bengaluru.

  <br/> <br/>If you align with our vision or can dedicate time and effort, please connect with us on <a  href="https://github.com/rungdung/research-narratives" target="_blank" >GitHub Issues.</a>

</p>

<br>
</div>

 
  <div id="links">
    Email at adhavan[dot]sivaraj16[at]gmail[dot]com

  </div>
</footer>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
