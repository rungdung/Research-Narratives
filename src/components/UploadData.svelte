<script context="module">
    // Exported to allow filtering in Filter.svelte
    export let properties = [];
    export let propertyValues = new Set();
    export let dialog;
</script>

<script>
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
    import { map } from "./Map.svelte";
    import { onMount } from "svelte";
    import maplibre from "maplibre-gl";
    import Popup from "./MarkerPopup.svelte";

    // file upload array
    let baseDB = {
        accepted: [],
        rejected: [],
    };

    // assign accepted files to baseDB
    function handleFilesSelect(e, files) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }

    async function loadData() {
        let fileType, layerType;
        let file = URL.createObjectURL(baseDB.accepted[baseDB.accepted.length - 1]);
        let fileName = baseDB.accepted[0].name.split(".")[0];
        // Get file type
        // to style map layers
        // and attach event listeners

        try {
            map.addSource(fileName, {
                type: "geojson",
                data: file,
            });
        } catch (error) {
            alert(error);
        }

        try {
            let responseData = await fetch(file).then((response) =>
                response.json()
            );
            fileType = responseData.features[0].geometry.type;
        } catch (error) {
            alert(error);
        }

        if (fileType == "Point") {
            map.addLayer({
                id: fileName + "-point",
                type: "circle",
                source: fileName,
                filter: ["==", "$type", "Point"],
                paint: {
                    "circle-radius": 6,
                    "circle-color": "#007cbf",
                },
            });
            layerType = "point";
        } else if (fileType == "LineString") {
            map.addLayer({
                id: fileName + "-line",
                type: "line",
                source: fileName,
                filter: ["==", "$type", "LineString"],
                paint: {
                    "line-color": "#007cbf",
                    "line-width": 2,
                },
            });
            layerType = "line";
        } else if (fileType == "Polygon") {
            map.addLayer({
                id: fileName + "-fill",
                type: "fill",
                source: fileName,
                filter: ["==", "$type", "Polygon"],
                paint: {
                    "fill-color": "#088",
                    "fill-opacity": 0.1,
                    "fill-outline-color": "green",
                },
            });
            layerType = "fill";
        }

        map.on("click", fileName + "-" + layerType, function (e) {
            let popupContainer = document.createElement("div");

            // create a new popup component instance
            // and save to object
            new Popup({
                target: popupContainer,
                props: {
                    feature: e.features[0],
                },
            });

            // set popup content to html object
            var popup = new maplibre.Popup({ closeOnClick: true })
                .setLngLat(e.lngLat)
                // append div to popup of maplibre
                .setDOMContent(popupContainer)
                .addTo(map)
        });

        // Change cursor style
        map.on("mouseenter", fileName + "-" + layerType, function () {
            map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", fileName + "-" + layerType, function () {
            map.getCanvas().style.cursor = "grab";
        });

        // Extract properties from GeoJSON features
        // for filtering in Filter.svelte
        loadProperties(file);
    }

    function loadProperties(file) {
        fetch(file)
            .then((response) => response.json())
            .then((data) => {
                // Extract properties from GeoJSON features
                data.features.forEach((feature) => {
                    Object.keys(feature.properties).forEach((key) => {
                        if (!properties.includes(key)) {
                            properties.push(key);
                        }
                        propertyValues.add(feature.properties[key]);
                    });
                });
            })
            .catch((error) => {
                console.error("Error fetching GeoJSON data:", error);
            });
    }

    onMount(() => {
        dialog.showModal();
    });
</script>

<dialog id="intro-file-drop" class="" bind:this={dialog}>
    <h1>Eli5'ing research sharing</h1>
    <h3>Please upload a base geojson dataset to begin exploring.</h3>
    <Dropzone
        on:drop={(e) => {
            handleFilesSelect(e, baseDB);
            baseDB = baseDB;
        }}
        multiple={false}
        containerClasses="dropzoneMain"
        containerStyles="rounded-md text-black p-1 w-40 bg-slate-700"
    >
        {#if baseDB.accepted.length > 0}
            <p>{baseDB.accepted[baseDB.accepted.length - 1].name}</p>
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

    :global(.maplibregl-popup-content) {
        background-color: transparent;
        box-shadow: none;
    }

    #intro-file-drop::backdrop {
        background: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.3));
        animation: fade-in 1s;
    }
    :global(.dropzoneMain) {
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
