const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// API routes - put these BEFORE static and catch-all
const foodRoutes = require('./routes/foodroutes');
app.use('/foods', foodRoutes);

// Serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '..', 'foodanalyzer', 'dist')));

// SPA fallback: serve index.html for any unknown route (after API routes)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'foodanalyzer', 'dist', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 7000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
