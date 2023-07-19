import App from "./App.svelte";
import "./app.css";
import { createClient } from "@supabase/supabase-js";

// Create a Supabase client instance
const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseKey = import.meta.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const app = new App({
  target: document.getElementById("app"),
  props: {
    supabase,
  },
});

export default app;
