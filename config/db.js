const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: 'localhost',
  port: 8889,         // Sesuaikan dengan port MAMP Anda
  user: 'root',
  password: 'root',   // Default MAMP password
  database: 'patungan'
});

module.exports = db;