<script>
    //import Poppler from "node-poppler";
    import Dropzone from "svelte-file-dropzone/Dropzone.svelte";

    //let poppler = new Poppler();

    let fileToParse = {
        accepted: [],
        rejected: [],
    };

    let parsedHTML;

    function handleFilesSelect(e, files) {
        const { acceptedFiles, fileRejections } = e.detail;
        files.accepted = [...files.accepted, ...acceptedFiles];
        files.rejected = [...files.rejected, ...fileRejections];
    }

    // async function parseFile(file) {
    //     console.log(file);
    //     file = URL.createObjectURL(file);
    //     const options = {
    //         firstPageToConvert: 1,
    //         lastPageToConvert: 2,
    //     };
    //     poppler.pdfToHtml(file, undefined, options).then((res) => {
    //         console.log(res);
    //     });
    // }
</script>

<Dropzone
    on:drop={(e) => {
        handleFilesSelect(e, fileToParse);
        fileToParse = fileToParse;
        //parseFile(fileToParse.accepted[0]);
    }}
    multiple={false}
    containerClasses="dropzone dropzoneAddSource text-black"
    containerStyles=""
/>

<style>
    :global(.dropzoneAddSource){
        width: 100%;
        height: 6em;
        max-width: 100% !important;
    }
</style>