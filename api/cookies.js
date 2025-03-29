const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Add this line to load .env file

// Alternative approach that also works with Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// For debugging
console.log('Environment vars loaded:', !!supabaseUrl, !!supabaseKey);

module.exports = async (req, res) => {
  // Set CORS headers for browser requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    const { data: cookies, error } = await supabase
      .from('cookies')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    res.status(200).json(cookies);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};