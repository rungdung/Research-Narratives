// src/routes/libraries/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ url, locals: { supabase, getSession } }) => {
	// Get the user session
	const session = await getSession();

	// Extract the 'id' parameter from the query parameters
	const id = url.searchParams.get('map_id');

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
		.eq('id', id)
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

	// If 'id' parameter is present, fetch data for a specific library
	if (id) {
		// Fetch library data from the 'libraries' table based on the 'id'
		const { data: researchMap } = await supabase
			.from('research_maps')
			.select('*')
			.eq('id', id)
			.single();

		// // Return data for the library page
		// return {
		// 	title: library.name,
		// 	description: library.description,
		// 	user: profile,
		// 	page: 'library'
		// };
	}

	return { title: profile.full_name, description: '', researchMap, resources };
};

export const actions = {
	// Action for creating a new library
	updateResearchMap: async ({ url, request, locals: { supabase, getSession } }) => {
		// Parse form data from the request
		// const formData = await request.formData();
		// const name = formData.get('name') as string;
		// const description = formData.get('description') as string;
		// const uid = formData.get('id') as string;
		// // Get the user session
		// const session = await getSession();
		// // Update mindmap
		// // Handle errors during library and permissions creation
		// if (error || error1) {
		// 	return fail(500, {
		// 		name,
		// 		description
		// 	});
		// }
		// // Return the created library details
		// return {
		// 	name,
		// 	description
		// };
	}
};
