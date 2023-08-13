import App from "./App.svelte";
import "./app.css";
import { createClient } from "@supabase/supabase-js";
import posthog from "posthog-js";

// Posthog for analytics
const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
posthog.init(posthogKey, {
  api_host: "https://app.posthog.com",
});

// Create a Supabase client instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = new App({
  target: document.getElementById("app"),
  props: {
    supabase,
  },
});

export default app;
