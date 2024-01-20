// src/routes/libraries/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ cookies, url, locals: { supabase, getSession } }) => {
	// Get the user session
	const session = await getSession();

	// Extract the 'id' parameter from the query parameters
	const mapId = url.searchParams.get('narrative_id');
	cookies.set('narrativeId', mapId, { path: '/' });

	// Redirect to the home page if the user is not authenticated
	if (!session) {
		throw redirect(303, '/');
	}

	// Fetch the user's profile data from the 'profiles' table
	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name`)
		.eq('id', session.user.id)
		.single();

	// get the research map
	const { data: narrative } = await supabase
		.from('narratives')
		.select('*')
		.eq('id', mapId)
		.single();

	// Check user's write permission for the library
	const { data: permission } = await supabase
		.from('permissions')
		.select('read')
		.eq('user_id', session.user.id)
		.eq('library_id', narrative.library_id)
		.single();

	// redirect to the home page if the user does not have permission
	if (!permission) {
		throw redirect(303, '/');
	}

	// get resources of the library
	const { data: resources } = await supabase
		.from('resources')
		.select('*')
		.eq('library_id', narrative.library_id);

	return { title: profile.full_name, description: '', narrative, resources };
};

export const actions = {};
