const express = require('express');
const pool = require('./db.js'); // Import database connection
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json()); // Allow JSON requests
app.use(cors()); // Enable CORS


const routes = require('./routes/bdgtroutes');
app.use('/', routes);

// Test route to check DB connection
app.get('/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()'); // Simple query
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Database connection failed');
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});