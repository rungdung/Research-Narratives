// src/routes/libraries/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession } }) => {
	// Get the user session
	const session = await getSession();

	// Redirect to the home page if the user is not authenticated
	if (!session) {
		throw redirect(303, '/');
	}

	// Fetch the list of libraries that the user has permission to view
	const { data: permittedLibraries } = await supabase
		.from('permissions')
		.select('library_id')
		.eq('user_id', session.user.id);

	// Check if the user has no permitted libraries
	if (!permittedLibraries) {
		return {
			session,
			libraries: []
		};
	} else {
		// Fetch details of permitted libraries
		const { data: libraries } = await supabase
			.from('libraries')
			.select('*')
			.in(
				'id',
				permittedLibraries.map((x) => x.library_id)
			);

		return { session, libraries };
	}
};

export const actions = {
	// Action for creating a new library
	createLibrary: async ({ request, locals: { supabase, getSession } }) => {
		// Parse form data from the request
		const formData = await request.formData();
		const name = formData.get('name') as string;
		const description = formData.get('description') as string;

		// Get the user session
		const session = await getSession();

		// Create a new library
		const id = crypto.randomUUID();
		const { error } = await supabase.from('libraries').insert({
			id: id,
			created_by: session?.user.id,
			created_at: new Date(),
			name: name,
			resources: [],
			description: description
		});

		// Insert new permissions for the user in the created library
		const { error: error1 } = await supabase.from('permissions').insert({
			library_id: id,
			read: true,
			write: true,
			update: true,
			delete: false,
			user_id: session?.user.id,
			created_by: session?.user.id
		});

		// Handle errors during library and permissions creation
		if (error || error1) {
			return fail(500, {
				name,
				description
			});
		}

		// Return the created library details
		return {
			name,
			description
		};
	}
};
