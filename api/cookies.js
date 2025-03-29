const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// This is the format Vercel expects for API routes
module.exports = async (req, res) => {
  // Add console.log for debugging
  console.log("API route /api/cookies called");
  console.log("Environment variables loaded:", !!supabaseUrl, !!supabaseKey);

  // Set CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const { data: cookies, error } = await supabase.from("cookies").select("*");

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // Perbaiki data cookie sebelum dikirim ke klien
    const fixedCookies = cookies.map((cookie) => {
      // Pastikan prefixes dipertahankan untuk cookies autentikasi
      if (cookie.name === "Secure-next-auth.session-token") {
        cookie.name = "__Secure-next-auth.session-token";
      }
      if (cookie.name === "Host-next-auth.csrf-token") {
        cookie.name = "__Host-next-auth.csrf-token";
      }
      if (cookie.name === "Secure-next-auth.callback-url") {
        cookie.name = "__Secure-next-auth.callback-url";
      }
      return cookie;
    });

    console.log("Data berhasil diperbaiki dan dikirim");
    return res.status(200).json(fixedCookies);
  } catch (error) {
    console.error("API error:", error);
    return res
      .status(500)
      .json({ error: "Server error", details: error.message });
  }
};
