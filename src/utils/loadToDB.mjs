import { createClient } from "@supabase/supabase-js";

// Create a Supabase client instance
const supabaseUrl = "https://zacbpuwktyeyjyficido.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InphY2JwdXdrdHlleWp5ZmljaWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc1MTgwODcsImV4cCI6MjAwMzA5NDA4N30.giVzX7nB_FDFSvDVqrL34qz1qn0wceWwP72XvtFJEns";
const supabase = createClient(supabaseUrl, supabaseKey);

export async function loadToDB(fileObj, fileName) {
  try {
    fileName = fileName.replace(" ", "-");
    const { data, error } = await supabase.storage
      .from("researchNarratives")
      .upload("public/" + fileName, fileObj);

    let fileUrl = await supabase.storage
      .from("researchNarratives")
      .getPublicUrl("public/" + fileName);

    console.log(fileUrl.data.publicUrl);
    return fileUrl.data.publicUrl;
  } catch (error) {
    console.error("Error uploading file:", error.message);
  }
}
