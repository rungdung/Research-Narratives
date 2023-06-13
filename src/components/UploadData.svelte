<script>
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";
    import { map } from "./Map.svelte";
    import { onMount } from "svelte";
    import maplibre from "maplibre-gl";
    import Popup from "./MarkerPopup.svelte";

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
            id: "baseDB",
            type: "circle",
            source: "baseDB",
            paint: {
                "circle-radius": 10,
                "circle-color": "#007cbf",
            },
        });

        map.on("click", "baseDB", function (e) {
            console.log(e.features[0].properties.title);
            let popupContainer = document.createElement("div");

            new Popup({
                target: popupContainer,
                props: {
                    title: e.features[0].properties.title,
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

        map.on("mouseenter", "baseDB", function () {
            map.getCanvas().style.cursor = "pointer";
        });

        map.on("mouseleave", "baseDB", function () {
            //revert to normal cursor style
            map.getCanvas().style.cursor = "grab";
        });
    }
</script>

<Dropzone
    on:drop={(e) => {
        handleFilesSelect(e, baseDB);
        baseDB = baseDB;
        loadData();
    }}
    accept=""
    containerStyles="rounded-md text-black p-1 w-40 bg-slate-700"
>
    Upload a base geojson file
</Dropzone>
