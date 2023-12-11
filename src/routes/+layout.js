// src/routes/+layout.ts
import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';

// The `load` function is a special function in SvelteKit that runs on the server and client during page transitions.
export const load = async ({ fetch, data, depends }) => {
	// Depend on the Supabase authentication data to ensure it's available before rendering the page.
	depends('supabase:auth');

	// Create a Supabase client for loading authentication information.
	const supabase = createSupabaseLoadClient({
		supabaseUrl: PUBLIC_SUPABASE_URL,
		supabaseKey: PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: data.session
	});

	// Fetch the user session from Supabase.
	const {
		data: { session }
	} = await supabase.auth.getSession();

	// Return the Supabase client and user session for use in the page component.
	return { supabase, session };
};
