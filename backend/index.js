const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config();

const app = express();

// 1. UPDATE CORS: Allow your specific Vercel URL
app.use(cors({
  origin: ["http://localhost:5173", "https://nutri-scan-app.vercel.app"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// API routes
const foodRoutes = require('./routes/foodroutes');
app.use('/foods', foodRoutes);
app.use('/api', foodRoutes);  // Also expose at /api prefix

// Serve uploads folder (Used for images)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- REMOVE OR COMMENT OUT THE FRONTEND SERVING CODE BELOW ---
/*
app.use(express.static(path.join(__dirname, '..', 'foodanalyzer', 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'foodanalyzer', 'dist', 'index.html'));
});
*/

// 2. Add a simple root route for health checks
app.get("/", (req, res) => {
  res.send("Food Analyzer API is running...");
});

const PORT = process.env.PORT || 7000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});