// src/routes/libraries/view/+page.server.ts
import { fail, redirect } from '@sveltejs/kit';
import { PRIVATE_SUPABASE_SERVICE_KEY } from '$env/static/private';
import { createClient } from '@supabase/supabase-js'
import { PUBLIC_SUPABASE_URL } from '$env/static/public';

const supabase = createClient(PUBLIC_SUPABASE_URL, PRIVATE_SUPABASE_SERVICE_KEY, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
})

// Access auth admin api
const adminAuthClient = supabase.auth.admin

export const load = async ({ cookies, url, locals: { supabase, getSession } }) => {
	// Get user session and library ID from the URL
	const session = await getSession();
	const libraryId = url.searchParams.get('id');

	// Set cookie
	cookies.set('libraryId', libraryId, { path: '/' });

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

	// Get users who have access to the library
	const { data: users } = await supabase
		.from('permissions')
		.select('user_id')
		.eq('library_id', libraryId);

	// Get the user's profile
	const { data: userProfiles } = await supabase
		.from('profiles')
		.select(`username, full_name, email`)
		.in('id', users.map(user => user.user_id));

	// Fetch user profile data
	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name`)
		.eq('id', session.user.id)
		.single();

	// fetch details of each resource as array
	const { data: resources } = await supabase
		.from('resources')
		.select('*')
		.eq('library_id', libraryId)
		.order('created_at', { ascending: false });

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

	return { session, profile, userProfiles, library, narratives, resources };
};

// Actions for the library view page
export const actions = {
	// Action for creating a new resource within the library
	createResource: async ({ cookies, request, locals: { supabase, getSession } }) => {
		// Parse form data from the request
		const formData = await request.formData();
		const resourceUrl = formData.get('url') as string;
		const source = formData.get('source') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const attributes = formData.get('attributes') as string;

		// Get library id from cookie
		const libraryId = cookies.get('libraryId');

		// Get user session
		const session = await getSession();

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

			// Generate a unique ID for the new resource
			const id = crypto.randomUUID();

			// Create the new resource
			const { error: error1 } = await supabase.from('resources').insert({
				id: id,
				url: resourceUrl,
				title: title,
				source: source,
				description: description,
				attributes: attributes,
				type: resourceUrl.split('.').pop(),
				library_id: libraryId,
				created_at: new Date()
			});

			if (error1) {
				return fail(500, {
					resourceUrl
				});
			}

			// Append the new resource id to the resources array of the library
			resources.resources.push({
				id: id
			});
			const { error } = await supabase
				.from('libraries')
				.update({ resources: resources.resources })
				.eq('id', libraryId);

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
	updateResource: async ({ cookies, request, locals: { supabase, getSession } }) => {
		// Get user session
		const session = await getSession();

		// Parse form data from the request
		const formData = await request.formData();
		const id = formData.get('id') as string;
		const title = formData.get('title') as string;
		const description = formData.get('description') as string;
		const source = formData.get('source') as string;

		// Get library id from cookie
		const libraryId = cookies.get('libraryId');

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
				.from('resources')
				.update({
					title: title,
					description: description,
					source: source
				})
				.eq('id', id);

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
	createResearchMap: async ({ cookies, request, locals: { supabase, getSession } }) => {
		// Get user session
		const session = await getSession();

		// Get library id from cookie
		const libraryId = cookies.get('libraryId');

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
	},

	addContributor: async ({ cookies, request, locals: { supabase, getSession } }) => {
		// Get user session
		const session = await getSession();

		// Get library id from cookie
		const libraryId = cookies.get('libraryId');

		// Get data from form
		// Parse form data from the request
		const formData = await request.formData();
		const contributorEmail = formData.get('email') as string;

		// Check if user exists and get Id
		let { data: contributorId } = await supabase
			.from('profiles')
			.select('id')
			.eq('email', contributorEmail)
			.single();


		if (!contributorId) {
			// Send an invitation email
			// after creating user
			// using the service key
			const { data, error } = await adminAuthClient.createUser({
				email: contributorEmail,
				user_metadata: {
					full_name: contributorEmail,
				}
			});
			await adminAuthClient.inviteUserByEmail(contributorEmail);
			contributorId = { id: data.user.id };
		}



		// Check user's write permission for the library
		const { data: permission } = await supabase
			.from('permissions')
			.select('write')
			.eq('user_id', session.user.id)
			.eq('library_id', libraryId)
			.single();

		// Proceed if the user has write permission
		if (permission?.write === true) {
			const { data, error } = await supabase.from('permissions').insert({
				library_id: libraryId,
				user_id: contributorId.id,
				write: true,
				update: true,
				delete: false,
				read: true,
				created_by: session?.user.id,
			});
		}
	}
};
