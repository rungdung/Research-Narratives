<script>
  import { uploadedSources } from "../stores";
  import { Accordion, AccordionItem } from "flowbite-svelte";

  // Get only the layer name and the appearance expression
  let layerStyles = $uploadedSources.filter((source) => {
    return source.appearanceExpression != null;
  });

  layerStyles = layerStyles.map((source) => {
    if (source.appearanceExpression) {
      return {
        fileName: source.fileName,
        layerName: source.appearanceExpression[2][1],
        appearanceExpression: source.appearanceExpression,
        zippedExpression: [],
      };
    }
  });

  // map the maplibre style expression into pairs for each break/ bin
  // each pair contains the break point (prev, next) and hex code for the colour
  layerStyles.forEach((layer) => {
    if (layer.appearanceExpression) {
      layer.appearanceExpression = layer.appearanceExpression.slice(3);
      for (let i = 0; i < layer.appearanceExpression.length; i += 2) {
        layer.zippedExpression.push([
          [
            layer.appearanceExpression[i - 2] ?? 0,
            layer.appearanceExpression[i],
          ],
          layer.appearanceExpression[i + 1],
        ]);
      }
    }
  });
</script>

<section id="Legend-Main" class="absolute right-0 bottom-5 w-1/6 m-2">
  <h2 class="text-left text-black my-2">Legend</h2>
  <Accordion flush>
    {#each layerStyles as layer}
      <section id="legend-{layer.fileName}">
        <AccordionItem class="bg-primary-50" paddingFlush="py-1 my-1" open>
          <h3 slot="header" class="">
            {@html layer.fileName + " " + layer.layerName}
          </h3>
          {#each layer.zippedExpression as item}
            <div class="flex items-center">
              <div class="w-4 h-4 mr-2" style="background-color: {item[1]}" />
              <span class="text-3xs">{@html item[0][0] + "-" + item[0][1]}</span
              >
            </div>
          {/each}
        </AccordionItem>
      </section>
    {/each}
  </Accordion>
</section>

<style>
  #Legend-Main {
    background-color: antiquewhite;
    border: 5px double black;
    border-radius: 10px;
    padding: 0em 1em;
  }
  .legend {
  }
</style>
