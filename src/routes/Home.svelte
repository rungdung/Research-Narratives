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
</script>

<Navbar let:hidden let:toggle>
  <NavBrand href="/">
    <span
      class="self-center whitespace-nowrap text-xl font-semibold dark:text-white"
    >
      Research Narratives
    </span>
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
