// src/app.d.ts

import { SupabaseClient, Session } from '@supabase/supabase-js';
import 'unplugin-icons/types/svelte';
declare global {
	namespace App {
		interface Locals {
			supabase: SupabaseClient;
			getSession(): Promise<Session | null>;
		}
		interface PageData {
			session: Session | null;
		}
		// interface Error {}
		// interface Platform {}
	}
}
