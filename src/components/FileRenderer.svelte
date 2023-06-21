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

    import { uploadedLayers } from "../stores";

    import PDFobject from "pdfobject";

    // file upload array
    let baseDB = {
            accepted: [],
            rejected: [],
        },
        link;

    let fileType, fileName;

    let fileViewPort;

    // assign accepted files to baseDB
    function handleFilesSelect(e, files) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }

    function updateLayerList(properties) {
        uploadedLayers.update((layers) => {
            layers.push({
                name: properties.name,
                type: properties.type,
                geometry: properties.geometry || "NA",
                blob: properties.blob || null,
                visible: properties.visible || true,
                container: properties.container || null,
            });
            return layers;
        });
    }

    async function loadData() {
        let currentIndex = baseDB.accepted.length - 1;
        let file = URL.createObjectURL(baseDB.accepted[currentIndex]);

        // use filename as source name for Maplibre
        // and push to store
        fileName = baseDB.accepted[currentIndex].name.split(".")[0];
        fileType = baseDB.accepted[currentIndex].name.split(".")[1];

        // Get file type
        // to style map layers
        // and attach event listeners
        if (fileType.toLowerCase() == "geojson") {
            loadSpatialData(file, fileName);
        } else if (fileType.toLowerCase() == "csv") {
        } else if (fileType.toLowerCase() == "pdf") {
            loadPDFData(file, fileName);
        } else {
            alert("File type not supported");
        }
    }

    async function loadPDFData(file, fileName) {
        try {
            console.log(fileViewPort);
            console.log(fileName);
            await PDFobject.embed(file, fileViewPort);
            updateLayerList({
                name: fileName,
                type: "PDF",
                geometry: "NA",
                blob: file,
                visible: true,
                container: fileViewPort,
            });
        } catch (error) {
            alert(error);
        }
    }

    async function loadLinkData() {
        let file = link;
        fileName = link.split("/").pop().split(".")[0];
        fileType = link.split("/").pop().split(".")[1];
        if (fileType) {
            if (fileType.toLowerCase() == "geojson") {
                loadSpatialData(file, fileName);
            } else if (fileType.toLowerCase() == "csv") {
            } else if (fileType.toLowerCase() == "pdf") {
                loadPDFData(file, fileName);
            }
        } else {
            // insert as iframe if not supported;
            fileViewPort.innerHTML = `<iframe src="${file}" width="100%" height="100%"></iframe>`;
            updateLayerList({
                name: fileName,
                type: "Link",
                geometry: "NA",
                blob: file,
                visible: true,
                container: fileViewPort,
            });
        }
    }
    
    async function loadSpatialData(file, fileName) {
        let layerType, layerName;
        try {
            let responseData = await fetch(file).then((response) =>
                response.json()
            );
            layerType = responseData.features[0].geometry.type;
        } catch (error) {
            alert(error);
        }

        try {
            map.addSource(fileName, {
                type: "geojson",
                data: file,
            });
        } catch (error) {
            alert(error);
        }

        if (layerType == "Point") {
            layerName = fileName + "-point";
            updateLayerList({
                name: layerName,
                type: "Spatial",
                geometry: "Point",
                blob: file,
                visible: true,
                container: fileViewPort,
            });

            map.addLayer({
                id: layerName,
                type: "circle",
                source: fileName,
                filter: ["==", "$type", "Point"],
                paint: {
                    "circle-radius": 6,
                    "circle-color": "#007cbf",
                },
            });
        } else if (layerType == "LineString") {
            layerName = fileName + "-line";
            updateLayerList({
                name: layerName,
                type: "Spatial",
                geometry: "LineString",
                blob: file,
                visible: true,
                container: fileViewPort,
            });
            map.addLayer({
                id: layerName,
                type: "line",
                source: fileName,
                filter: ["==", "$type", "LineString"],
                paint: {
                    "line-color": "#007cbf",
                    "line-width": 2,
                },
            });
        } else if (layerType == "Polygon" || layerType == "MultiPolygon") {
            layerName = fileName + "-fill";
            updateLayerList({
                name: layerName,
                type: "Spatial",
                geometry: "Polygon",
                blob: file,
                visible: true,
                container: fileViewPort,
            });
            map.addLayer({
                id: layerName,
                type: "fill",
                source: fileName,
                filter: ["==", "$type", "Polygon"],
                paint: {
                    "fill-color": "#088",
                    "fill-opacity": 0.1,
                    "fill-outline-color": "green",
                },
            });
        }

        map.on("click", layerName, function (e) {
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
                .addTo(map);
        });

        // Change cursor style
        map.on("mouseenter", layerName, function () {
            map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", layerName, function () {
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

<section id="fileViewPort" bind:this={fileViewPort} />

<dialog id="intro-file-drop" class="" bind:this={dialog}>
    <h1>Eli5'ing research sharing</h1>
    <h3>
        Upload a PDF or a geojson file. You can even enter a link as a source
    </h3>
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
    <section id="link-upload">
        <input
            class="rounded-md text-white p-1 bg-slate-700"
            placeholder="Paste a link to access"
            bind:value={link}
        />

        <button
            class="rounded-md"
            on:click={() => {
                loadLinkData();
                dialog.close();
            }}>Load from link</button
        >
    </section>

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
    #link-upload {
        display: flex;
        width: 100%;
        margin: 1em 0em;
    }
    #link-upload input {
        min-width: 80%;
    }
    #fileViewPort {
        position: absolute;
        top: 3em;
        left: 25em;
        z-index: 5;
        width: 30em !important;
        height: 40em !important;
    }
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
