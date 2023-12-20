// src/routes/libraries/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';

let mapId;
export const load = async ({ url, locals: { supabase, getSession } }) => {
	// Get the user session
	const session = await getSession();

	// Extract the 'id' parameter from the query parameters
	mapId = url.searchParams.get('map_id');

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
	const { data: researchMap } = await supabase
		.from('research_maps')
		.select('*')
		.eq('id', mapId)
		.single();

	// Check user's write permission for the library
	const { data: permission } = await supabase
		.from('permissions')
		.select('read')
		.eq('user_id', session.user.id)
		.eq('library_id', researchMap.library_id)
		.single();

	// redirect to the home page if the user does not have permission
	if (!permission) {
		throw redirect(303, '/');
	}

	// get resources of the library
	const { data: resources } = await supabase
		.from('libraries')
		.select('resources')
		.eq('id', researchMap.library_id)
		.single();

	return { title: profile.full_name, description: '', researchMap, resources };
};

export const actions = {
	// Action for creating a new library
	updateNarrativeSection: async ({ request, locals: { supabase, getSession } }) => {
		// Parse form data from the request
		const formData = await request.formData();
		let narrativeSections = formData.get('narrative-sections');
		narrativeSections = JSON.parse(narrativeSections);

		// Get the user session
		const session = await getSession();

		const { error } = await supabase
			.from('research_maps')
			.update({
				narrative_sections: narrativeSections
			})
			.eq('id', mapId);

		if (error) {
			return fail(500, { error });
		}
	},
	updateResearchMap: async ({ request, locals: { supabase, getSession } }) => {
		// Parse form data from the request
		const formData = await request.formData();
		let nodes = formData.get('nodes');
		let edges = formData.get('edges');
		nodes = JSON.parse(nodes);
		edges = JSON.parse(edges);

		// Get the user session
		const session = await getSession();

		// Update mindmap
		const { error } = await supabase
			.from('research_maps')
			.update({
				nodes: nodes,
				edges: edges
			})
			.eq('id', mapId);

		if (error) {
			return fail(500, { error });
		}

		// Parse form data from the request
	}
};
