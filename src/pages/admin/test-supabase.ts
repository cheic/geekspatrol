import { supabase } from "../../lib/supabase";

async function testSupabase() {
  try {
    const { data, error } = await supabase.from("articles").select("*").limit(1);
    if (error) {
      console.error("Erreur Supabase:", error.message);
      return { ok: false, error: error.message };
    }
    return { ok: true, data };
  } catch (err) {
    console.error("Exception Supabase:", err);
    return { ok: false, error: (err as Error).message };
  }
}

// Pour tester, exécutez :
testSupabase().then(console.log);
