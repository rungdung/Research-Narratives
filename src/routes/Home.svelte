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
  } from "flowbite-svelte";

  import Scrolly from "../components/Scrolly.svelte";

  let value = 0,
    sequence = [
      {
        text: "What if research and data analysis was a more visual experience that could be communicated?",
        visual: "../../assets/home-example-1.png",
      },
      {
        text: "Upload your resources and annotate all of them in the same space",
        visual: "https://i.imgur.com/8Z1Q1ZM.png",
      },
      {
        text: "Create a mindmap of annotations between resources",
        visual: "https://i.imgur.com/8Z1Q1ZM.png",
      },
      {
        text: "Make interactive data stories to share",
        visual: "https://i.imgur.com/8Z1Q1ZM.png",
      },
      {
        text: "If you want to share your annotations, share them along with your data",
        visual: "https://i.imgur.com/8Z1Q1ZM.png",
      },
    ];
</script>

<Navbar let:hidden let:toggle class="!bg-primary w-screen mx-5 my-5">
  <NavBrand href="/">
    <h1
      class="self-center whitespace-nowrap text-4xl font-semibold text-yellow-500 dark:text-white"
    >
      Research Narratives
    </h1>
  </NavBrand>
  <NavHamburger on:click={toggle} />
  <NavUl {hidden}>
    <NavLi href="/" active={true}>Home</NavLi>
    <NavLi id="nav-menu1" class="cursor-pointer"
      ><Chevron aligned>Possibilities</Chevron></NavLi
    >
    <NavLi href="">Going forward</NavLi>
    <NavLi href="">Alpha</NavLi>
    <NavLi href="">Contact</NavLi>
    <Dropdown triggeredBy="#nav-menu1" class="w-44 z-20">
      <DropdownItem>Spatial Data exploration</DropdownItem>
      <DropdownItem>Mindmapping data</DropdownItem>
      <DropdownItem>Share and collaborate</DropdownItem>
    </Dropdown>
  </NavUl>
</Navbar>

<body class="section-container h-screen">
  <section id="scrolly" class="mx-auto h-screen">
    <section class="steps-container">
      <Scrolly bind:value>
        {#each sequence as text, i}
          <div class="step" class:active={value == i}>
            <section id="text" class="p-6 flex text-left m-3 items-center">
              <h2 class="text-5xl block">
                {@html text.text}
              </h2>
            </section>
            <section
              id="visual-content"
              class="shadow-2xl object-contain shadow-black"
            >
              {#if value >= 0}
                <img
                  src={sequence[value].visual}
                  alt="preview"
                  class="h-screen object-cover"
                />
              {/if}
            </section>
          </div>
        {/each}
      </Scrolly>
    </section>
  </section>
</body>
<section id="trial" class="w-screen">
  Check out these sample data stories
</section>
<footer class="w-screen">
  <h1>Thanks!</h1>
  <h2>
    <a href="" target="_blank">Github</a>
  </h2>
</footer>

<style>
  :global(body) {
    overflow-x: hidden;
  }
  .step {
    display: flex;
    flex-direction: row;
    height: 100vh;
    width: 100%;
  }
  #text {
    flex: 40%;
  }

  #visual-content {
    flex: 60%;
  }

  /* Comment out the following line to always make it 'text-on-top' */
  @media screen and (max-width: 768px) {
    .section-container {
      flex-direction: column-reverse;
    }
    .sticky {
      width: 95%;
      margin: auto;
    }
  }
</style>
