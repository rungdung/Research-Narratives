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
      visual: "../../assets/researchMap.webm",
    },
    {
      id: "filtering",
      text: "Visualise your spatial data with filters and Choropleths",
      visual: "../../assets/spatialFeatures.webm",
    },
    {
      id: "rendered-stories",
      text: "Convert your mindmaps into interactive data stories",
      visual: "../../assets/renderedStory.webm",
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
      image: "../../assets/landuse-bengaluru-sample-thumbnail.jpg",
      link: "./demo/RenderedStory?uuid=4be2d2ce-8431-48d4-8ae7-c1a56177e98c",
    },
    {
      title: "Geographical Patterns of Child Malnutrition in Karnataka",
      description:
        "Even after making decades of progress, India is still home to a major fraction of the world's malnourished children. Malnutrition in early childhood is associated with lower cognitive and physical ability, and can have a lifelong impact...",
      image: "../../assets/stunting-karnataka-sample-thumbnail.jpg",
      link: "./demo/RenderedStory?uuid=4e0aeb83-702e-4403-868a-ff081622229d",
    },
    {
      title: "Try out the proof of concept",
      description:
        "You can upload your own data and create your own stories. The tool is in its alpha stages, so please bear with us. We are looking for contributors to help us build this tool. If you are interested, please reach out to us at...",
      image: "../../assets/empty-home-sample-thumbnail.jpg",
      link: "./demo/",
      type: "demo",
    },
  ];

  let roadMap;
</script>

<section class="bg-primary-50 text-black">
  <Navbar
    let:hidden
    let:toggle
    class="bg-gradient-to-b from-primary-100 to-primary-50   py-5"
    navDivClass="items-center px-6 py-10 "
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
      A visual interface for multi-media and spatial data annotation. In alpha,
      looking for contributors
    </p>
    <NavHamburger on:click={toggle} />
    <NavUl {hidden} activeClass="" divClass="w-1/2 md:block ">
      <NavLi id="nav-menu1" class="cursor-pointer"
        ><Chevron aligned>Possibilities</Chevron></NavLi
      >
      <Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
        <DropdownItem href="/#filtering">Spatial Data exploration</DropdownItem>
        <DropdownItem href="/#spatial-whiteboarding"
          >Mindmapping data</DropdownItem
        >
        <DropdownItem href="/#collaboration">Share and collaborate</DropdownItem
        >
        <DropdownItem href="/#rendered-stories">Create datastories</DropdownItem
        >
      </Dropdown>
      <NavLi href="/#roadmap">Going forward</NavLi>
      <NavLi href="/#demo">Alpha</NavLi>
      <NavLi href="/#github">Contact</NavLi>
    </NavUl>
  </Navbar>

  <section class="grid md:grid-cols-2 sm:grid-cols-2">
    {#each sequence as { id, text, visual }}
      <section id="text" class="p-6 text-left m-3 max-w-prose sm:pt-10 sm:h-50">
        <h2 {id} class="sm:text-4xl text-2xl align-middle">
          {@html text}
        </h2>
      </section>

      {#if visual}
        <section
          id="visual-content"
          class="shadow-2xl object-contain shadow-black mx-5 sm:mx-1 sm:my-10"
          in:fly={{ x: 100, duration: 800 }}
        >
          <video class=" md:object-cover" autoplay muted loop>
            <source src={visual} type="video/webm" />
          </video>
        </section>
      {/if}
    {/each}
  </section>
  <section id="trial" class="w-screen p-5 text-left content-center mx-auto">
    <h2 id="demo" class="text-4xl text-center py-10">
      Check these sample stories out
    </h2>
    <section class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
      {#each sampleStories as { title, description, image, link, type }}
        <Card class="p-0 bg-brown drop-shadow m-3" img={image}>
          <h2 class="text-2xl text-black py-2">{title}</h2>
          <p>{description}</p>
          <Button class="bg-gray-500 my-4" size="xs" href={link}>View</Button>
        </Card>
      {/each}
    </section>
  </section>

  <section id="roadmap">
    The project is being tracked on a public Github Project here: <a
      href="https://github.com/users/rungdung/projects/3/views/1"
      target="_blank"
    >
      Link
    </a>
  </section>
</section>

<footer
  class="w-screen bg-gradient-to-t from-primary-200 to-primary-50 text-black text-left px-10 py-40 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 space-x-5"
>
  <p class="pr-5">
    This project is a proof of concept in development and requires active
    contributors. If you share our vision or can contribute time and effort to
    develop this, reach out to us on Github Issues. This proof of concept was
    developed as part of an internship at the Indian Institute for Human
    Settlements, Bengaluru.
  </p>

  <p>This project is being developed under the Apache license</p>
  <p id="links">
    Email at adhavan16[dot]sivaraj[at]gmail[dot]com
    <a href="" target="_blank">Github</a>
  </p>
</footer>

<style>
  :global(html) {
    scroll-behavior: smooth;
  }
</style>
