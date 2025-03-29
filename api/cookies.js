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
      // Pastikan format seragam dengan nama properti yang tepat
      const fixedCookie = {
        name: cookie.name,
        value: cookie.value,
        domain: cookie.domain,
        path: cookie.path || "/",
        secure: Boolean(cookie.secure),
        httpOnly: Boolean(cookie.http_only || cookie.httpOnly),
        sameSite: cookie.same_site || cookie.sameSite,
        expirationDate: cookie.expiration_date || cookie.expirationDate,
        hostOnly: Boolean(cookie.host_only || cookie.hostOnly),
        session: Boolean(cookie.session),
      };

      // Pastikan prefixes dipertahankan untuk cookies autentikasi
      if (fixedCookie.name === "Secure-next-auth.session-token") {
        fixedCookie.name = "__Secure-next-auth.session-token";
      }
      if (fixedCookie.name === "Host-next-auth.csrf-token") {
        fixedCookie.name = "__Host-next-auth.csrf-token";
      }
      if (fixedCookie.name === "Secure-next-auth.callback-url") {
        fixedCookie.name = "__Secure-next-auth.callback-url";
      }

      return fixedCookie;
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
