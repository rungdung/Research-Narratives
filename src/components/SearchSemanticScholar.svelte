<script>
    let query;
    let results = [];
    async function runQuery(query) {
        fetch(
            "https://api.semanticscholar.org/graph/v1/paper/autocomplete?query=" +
                query
        )
            .then((response) => response.json())
            .then((data) => (results = data.matches))
            .catch((error) => {
                console.log(error);
                return [];
            });
    }
    $: if (query && query.length > 3) {
        runQuery(query);
    }
</script>

<input
    type="text"
    id="search-semanticScholar"
    bind:value={query}
    class="rounded-md text-white p-1 w-40 bg-slate-600"
    placeholder="Search for a paper on semantic scholar"
/>

{#if results}
    <section id="results">
        {#each results as result}
            <li class="p-4">
                {@html result.title + " " + result.authors}
                <button
                    on:click={() => {
                        window.open(
                            `https://api.semanticscholar.org/` + result.id,
                            "_blank"
                        );
                    }}
                    class="text-xs p-1 bg-slate-800 rounded-md"
                    >Open
                </button>
            </li>
        {/each}
    </section>
{/if}

<style>
    #search-semanticScholar {
        top: 0;
        left: 0;
        width: 100%;
    }
    #results {
        max-height: 20vh;
        overflow-y: scroll;
    }
</style>
