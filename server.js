const express = require('express');
const cookiesRoute = require('./api/cookies');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Mount the API route
app.get('/api/cookies', cookiesRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});