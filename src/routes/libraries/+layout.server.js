import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ url, locals: { supabase, getSession } }) => {
	// Get the user session
	const session = await getSession();

	// Extract the 'id' parameter from the query parameters
	const id = url.searchParams.get('id');

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

	// If 'id' parameter is present, fetch data for a specific library
	if (id) {
		// Fetch library data from the 'libraries' table based on the 'id'
		const { data: library } = await supabase.from('libraries').select('*').eq('id', id).single();

		// Return data for the library page
		return {
			title: library.name,
			description: library.description,
			user: profile,
			page: 'library'
		};
	}

	// If 'id' parameter is not present, return data for the user's profile page
	return { title: profile.full_name, description: '', user: profile, page: 'profile' };
};
