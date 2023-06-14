<script>
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
    import { map } from "./Map.svelte";
    import { onMount } from "svelte";
    import maplibre from "maplibre-gl";
    import Popup from "./MarkerPopup.svelte";

    let dialog;

    let baseDB = {
        accepted: [],
        rejected: [],
    };

    function handleFilesSelect(e, files) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }

    function loadData() {
        console.log(baseDB.accepted[0]);
        let file = URL.createObjectURL(baseDB.accepted[0]);
        map.addSource("baseDB", {
            type: "geojson",
            data: file,
        });

        map.addLayer({
            id: "baseDB-line",
            type: "line",
            source: "baseDB",
            filter: ["==", "$type", "LineString"],
        });

        map.addLayer({
            id: "baseDB-point",
            type: "circle",
            source: "baseDB",
            filter: ["==", "$type", "Point"],
        });

        map.addLayer({
            id: "baseDB-fill",
            type: "fill",
            source: "baseDB",
            filter: ["==", "$type", "Polygon"],
        });

        map.on("click", "baseDB-point", function (e) {
            console.log(e.features[0].properties.title);
            let popupContainer = document.createElement("div");

            new Popup({
                target: popupContainer,
                props: {
                    title: e.features[0].properties.title ?? "No title",
                    date: e.features[0].properties.date,
                    link: e.features[0].properties.link,
                    excerpt: e.features[0].properties.excerpt,
                    feature: e.features[0],
                },
            });
            var popup = new maplibre.Popup({ closeOnClick: true })
                .setLngLat(e.lngLat)
                // append div to popup of maplibre
                .setDOMContent(popupContainer)
                .addTo(map);
        });

        map.on("mouseenter", "baseDB-point", function () {
            map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "baseDB-point", function () {
            //revert to normal cursor style
            map.getCanvas().style.cursor = "grab";
        });

    }


    onMount(() => {
        dialog.showModal();
    });
</script>

<dialog id="intro-file-drop" class="" bind:this={dialog}>
    <h1>Test</h1>
    <h3>Please upload a base geojson dataset to begin exploring.</h3>
    <Dropzone
        on:drop={(e) => {
            handleFilesSelect(e, baseDB);
            baseDB = baseDB;
        }}
        multiple={false}
        containerClasses="dropzone3"
        containerStyles="rounded-md text-black p-1 w-40 bg-slate-700"
    >
        {#if baseDB.accepted.length > 0}
            <p>{baseDB.accepted[0].name}</p>
        {:else}
            Drag and drop or click to open a GeoJSON file.
        {/if}
    </Dropzone>
    <button class="rounded-md" on:click={() => dialog.close()}>Close</button>
    <button
        class="rounded-md"
        on:click={() => {
            loadData();
            dialog.close();
        }}>Load on map</button
    >
</dialog>

<style>
    :global(#intro-file-drop) {
        border: 2px dashed #007cbf;
        background-color: antiquewhite;
        opacity: 1;
        border-radius: 5px;
        padding: 3em;
        text-align: left;
        color: black;
    }
    #intro-file-drop::backdrop {
        background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
        animation: fade-in 1s;
    }
    :global(.dropzone3) {
        height: 10em !important;
        width: 100%;
        margin: 1em 0em;
        max-width: 100% !important;
        text-align: center;
    }

    @keyframes fade-in {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }
</style>
