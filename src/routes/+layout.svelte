<!-- src/routes/+layout.svelte -->
<script >
	import '../app.css'
	import { invalidate } from '$app/navigation'
	import { onMount } from 'svelte'

	export let data

	let { supabase, session } = data
	$: ({ supabase, session } = data)

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((event, _session) => {
			if (_session?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth')
			}
		})

		return () => data.subscription.unsubscribe()
	})
</script>

<body class="w-screen">
	<slot />
</body>

<svelte:head>
	<title>Research Narratives</title>
</svelte:head>
