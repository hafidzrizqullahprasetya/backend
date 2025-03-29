const express = require('express');
const supabase = require('../config/db');
const router = express.Router();

router.get('/cookies', async (req, res) => {
  try {
    const { data: cookies, error } = await supabase
      .from('cookies')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    res.json(cookies);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;