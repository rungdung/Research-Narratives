// src/routes/login/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals: { getSession } }) => {
	// Check if there is an active user session
	const session = await getSession();

	// If the user is already logged in, redirect them to the account page
	if (session) {
		throw redirect(303, '/account');
	}

	// If the user is not logged in, return the URL origin (e.g., the login page)
	return { url: url.origin };
};
