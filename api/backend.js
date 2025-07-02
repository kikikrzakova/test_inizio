const express = require('express');
const axios = require('axios');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors()); // Enable CORS for all routes
const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/search', async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: 'Missing query' });

  try {
    const response = await axios.get('https://serpapi.com/search.json', {
      params: {
        q: query,
        engine: 'google',
        api_key: process.env.SERPAPI_KEY
      }
    });

    const results = response.data.organic_results || [];
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Search failed', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app; // Export the app for testing