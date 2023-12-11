import { redirect } from '@sveltejs/kit';

// Define the GET method for the server endpoint
export const GET = async ({ url, locals: { supabase } }) => {
	// Extract the authorization code from the query parameters
	const code = url.searchParams.get('code');

	// If an authorization code is present, exchange it for a user session using Supabase
	if (code) {
		await supabase.auth.exchangeCodeForSession(code);
	}

	throw redirect(303, '/account');
};
