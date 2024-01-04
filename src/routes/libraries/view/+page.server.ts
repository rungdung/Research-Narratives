// src/routes/libraries/view/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';

// Global Library ID to access
let libraryId = '';

export const load = async ({ url, locals: { supabase, getSession } }) => {
	// Get user session and library ID from the URL
	const session = await getSession();
	libraryId = url.searchParams.get('id');

	// Redirect to the home page if the user is not authenticated
	if (!session) {
		throw redirect(303, '/');
	}

	// Check user's write permission for the library
	const { data: permission } = await supabase
		.from('permissions')
		.select('read')
		.eq('user_id', session.user.id)
		.eq('library_id', libraryId)
		.single();

	// redirect to the home page if the user does not have permission
	if (!permission) {
		throw redirect(303, '/');
	}

	// Fetch user profile data
	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name`)
		.eq('id', session.user.id)
		.single();

	// Fetch details of the specified library
	const { data: library } = await supabase
		.from('libraries')
		.select('*')
		.eq('id', libraryId)
		.single();

	// Fetch all Research Maps associated with the library
	const { data: narratives } = await supabase
		.from('narratives')
		.select('*')
		.eq('library_id', libraryId);

	return { session, profile, library, narratives };
};

// Actions for the library view page
export const actions = {
	// Action for creating a new resource within the library
	createResource: async ({ request, locals: { supabase, getSession } }) => {
		// Parse form data from the request
		const formData = await request.formData();
		const resourceUrl = formData.get('url') as string;
		const source = formData.get('source') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		// Get user session
		const session = await getSession();

		// Generate a unique ID for the new resource
		const id = crypto.randomUUID();

		// Check user's write permission for the library
		const { data: permission } = await supabase
			.from('permissions')
			.select('write')
			.eq('user_id', session.user.id)
			.eq('library_id', libraryId)
			.single();

		// Proceed if the user has write permission
		if (permission?.write === true) {
			// Fetch the existing resources of the library
			let { data: resources } = await supabase
				.from('libraries')
				.select('resources')
				.eq('id', libraryId)
				.single();

			// Append the new resource to the resources array
			resources.resources.files.push({
				id: id,
				url: resourceUrl,
				title: title,
				source: source,
				description: description,
				type: resourceUrl.split('.').pop()
			});

			// Update the resources of the library
			const { error } = await supabase
				.from('libraries')
				.update({ resources: resources.resources })
				.eq('id', libraryId);

			// Handle errors during resource creation
			if (error) {
				return fail(500, {
					resourceUrl
				});
			}
		}

		// Return the library ID and resource URL
		return { libraryId, resourceUrl };
	},

	// Action for updating resources within the library
	updateResource: async ({ request, locals: { supabase, getSession } }) => {
		// Get user session
		const session = await getSession();

		// Parse form data from the request
		const formData = await request.formData();
		const updatedResources = JSON.parse(formData.get('resources') as string) as any;

		// Check user's update permission for the library
		const { data: permission } = await supabase
			.from('permissions')
			.select('update')
			.eq('user_id', session.user.id)
			.eq('library_id', libraryId)
			.single();

		// Proceed if the user has update permission
		if (permission?.update === true) {
			// Update the resources of the library with the provided data
			const { error } = await supabase
				.from('libraries')
				.update({
					resources: updatedResources
				})
				.eq('id', libraryId);

			// Handle errors during resource update
			if (error) {
				return fail(500, {
					error
				});
			}
		}

		// Return the library ID
		return { libraryId };
	},

	// Action for creating a new Research Map
	createResearchMap: async ({ request, locals: { supabase, getSession } }) => {
		// Get user session
		const session = await getSession();

		// Get data from form
		// Parse form data from the request
		const formData = await request.formData();
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;

		// Check user's write permission for the library
		const { data: permission } = await supabase
			.from('permissions')
			.select('write')
			.eq('user_id', session.user.id)
			.eq('library_id', libraryId)
			.single();

		// Proceed if the user has write permission
		if (permission?.write === true) {
			const id = crypto.randomUUID();
			const { error } = await supabase.from('narratives').insert({
				id: id,
				library_id: libraryId,
				created_by: session?.user.id,
				created_at: new Date(),
				title: title,
				description: description
			});
		}
	}
};
