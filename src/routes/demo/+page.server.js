import { fail, redirect } from '@sveltejs/kit';

export const load = async ({ locals: { supabase, getSession }, url }) => {
	const session = await getSession();

	// if (!session) {
	// 	throw redirect(303, '/');
	// }

	let uuid = url.searchParams.get('uuid');

	if (uuid) {
		const { data: data } = await supabase.from('nodes_1').select('*').eq('uuid', uuid).single();

		return { data: data } ?? { data: data };
	} else {
		return {};
	}
};
