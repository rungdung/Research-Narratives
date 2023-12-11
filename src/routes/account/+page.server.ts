import { fail, redirect } from '@sveltejs/kit';

// Load function for fetching user session and profile data
export const load = async ({ locals: { supabase, getSession } }) => {
	// Get the user session
	const session = await getSession();

	// Redirect to the home page if the user is not authenticated
	if (!session) {
		throw redirect(303, '/');
	}

	// Fetch user profile data from the 'profiles' table
	const { data: profile } = await supabase
		.from('profiles')
		.select(`username, full_name`)
		.eq('id', session.user.id)
		.single();

	return { session, profile };
};

// Actions for updating profile and signing out
export const actions = {
	// Update user profile
	update: async ({ request, locals: { supabase, getSession } }) => {
		// Parse form data from the request
		const formData = await request.formData();
		const fullName = formData.get('fullName') as string;
		const username = formData.get('username') as string;

		// Get the user session
		const session = await getSession();

		// Upsert (update or insert) user profile data in the 'profiles' table
		const { error } = await supabase.from('profiles').upsert({
			id: session?.user.id,
			full_name: fullName,
			username,
			updated_at: new Date()
		});

		// Handle errors during the upsert operation
		if (error) {
			return fail(500, {
				fullName,
				username
			});
		}

		// Return updated profile information
		return {
			fullName,
			username
		};
	},

	// Sign out user
	signout: async ({ locals: { supabase, getSession } }) => {
		// Get the user session
		const session = await getSession();

		// Sign out the user and redirect to the home page
		if (session) {
			await supabase.auth.signOut();
			throw redirect(303, '/');
		}
	}
};
