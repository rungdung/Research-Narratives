let resourceId = '';
let libraryId = '';

export const load = async ({ url, locals: { supabase, getSession } }) => {
	// Get the user session
	const session = await getSession();

	// Extract the 'id' parameter from the query parameters
	resourceId = url.searchParams.get('resource_id');

	// Redirect to the home page if the user is not authenticated
	if (!session) {
		throw redirect(303, '/');
	}

	// Fetch the resource data
	const { data: resource } = await supabase
		.from('resources')
		.select('*')
		.eq('id', resourceId)
		.single();

	libraryId = resource.library_id;

	// Possibly perform datatype conversions, optimizations here.
	return { resource, attributes: resource.attributes };
};

export const actions = {
	// Action for creating a new library
	saveAnnotation: async ({ request, locals: { supabase, getSession } }) => {
		// Get user session
		const session = await getSession();

		// Parse form data from the request
		const formData = await request.formData();
		let filter = formData.get('filter');
		let appearance = formData.get('appearance');

		// Check user's write permission for the library
		const { data: permission } = await supabase
			.from('permissions')
			.select('write')
			.eq('user_id', session.user.id)
			.eq('library_id', libraryId)
			.single();

		// Proceed if the user has write permission
		if (permission?.write === true) {
			const { error } = await supabase.from('annotations').insert({
				type: 'spatial',
				resource_id: resourceId,
				spatial_filter: filter,
				spatial_appearance: appearance
			});
		}
	}
};
