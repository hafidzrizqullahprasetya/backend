const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = async (req, res) => {
  try {
    const { data: cookies, error } = await supabase
      .from('cookies')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    res.status(200).json(cookies);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
};