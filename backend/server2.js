const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Upload folder
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });

// Upload route
app.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send({ error: 'No file uploaded' });

  // Send image URL to frontend
  const imageUrl = `http://localhost:5000/uploads/${req.file.filename}`;
  res.json({ imageUrl });
});

// Start server
app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});
