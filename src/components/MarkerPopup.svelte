<script>
  export let title;
  export let date;
  export let link;
  export let excerpt;
  export let feature;

  import { selectedFeatures } from "../stores.js";
  async function addToList() {
    const newFeature = {
      title: title,
      date: date,
      link: link,
      excerpt: excerpt,
      feature: feature,
    };

    selectedFeatures.update((features) => {
      features.push(newFeature);

      console.log("pushing to selected features");
      console.log(features);
      return features;
    });
  }
</script>

<div class="popup">
  <h3>{@html title}</h3>
  <p>{date}</p>
  <a href={link}>Link to article</a>
  <p>{@html excerpt}</p>
  <br />
  <button class="bg-slate-700" id="addToList" on:click={() => addToList()}>
    Add to research map
  </button>
</div>

<style>
  .popup {
    padding: 2em;
    border-radius: 5px;
    background-color: rgb(247, 240, 230);
    width: 300px;
    color: black;
    text-align: left;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
  }

  .popup h3 {
    margin: 0;
    font-size: 1.2rem;
  }

  .popup p {
    margin: 0;
    font-size: 0.8rem;
  }

  .popup a {
    font-size: 0.8rem;
  }

  .popup button {
    margin-top: 10px;
    padding: 5px;
    border-radius: 5px;
    color: #fff;
  }
</style>
