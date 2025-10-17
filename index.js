const express = require('express');
const pool = require('./db'); // Import database connection
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const categoriesRoutes = require('./routes/categoriesRoutes');
const transferRoutes = require('./routes/transferRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const envelopeRoutes = require('./routes/envelopesRoutes');

const app = express();
app.use(express.json()); // Allow JSON requests
app.use(cors()); // Enable CORS

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/categories', categoriesRoutes);
app.use('/transfers', transferRoutes);
app.use('/transactions', transactionRoutes);
app.use('/envelopes', envelopeRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to my API!');
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running at: http://localhost:${PORT}`);
});