const express = require('express');
const db = require('../config/db');
const router = express.Router();

router.get('/cookies', async (req, res) => {
  try {
    const [cookies] = await db.query('SELECT * FROM cookies');
    res.json(cookies);
  } catch (error) {
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

module.exports = router;