import { createClient } from "@supabase/supabase-js";

// Create a Supabase client instance
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
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
