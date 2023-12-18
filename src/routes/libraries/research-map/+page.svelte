<script>
	import { SvelteFlowProvider } from '@xyflow/svelte';

	import Flow from './nodes/Flow.svelte';

	export let data;

	// Destructure data object and set up reactivity
	let { session, supabase, researchMap, resources } = data;
	$: ({ session, supabase, researchMap, resources } = data);
</script>

<SvelteFlowProvider>
	<Flow {resources} title={researchMap.title} description={researchMap.description} />
</SvelteFlowProvider>
