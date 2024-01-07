export const load = async ({ url, locals: { supabase, getSession } }) => {
	// Get the user session
	const session = await getSession();

	// Extract the 'id' parameter from the query parameters
	let resourceId = url.searchParams.get('resource_id');

	// Redirect to the home page if the user is not authenticated
	if (!session) {
		throw redirect(303, '/');
	}

	// Fetch the user's profile data from the 'profiles' table
	const { data: resource } = await supabase
		.from('resources')
		.select('*')
		.eq('id', resourceId)
		.single();

	// Possibly perform datatype conversions, optimizations here.

	return { resource };
};

