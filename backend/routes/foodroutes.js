const express = require('express');
const router = express.Router();
const Food = require("../models/food");
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET all foods
router.get('/', async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// SEARCH food by exact name (case-insensitive)
router.get('/search', async (req, res) => {
  try {
    const searchTerm = req.query.name;
    if (!searchTerm) {
      return res.status(400).json({ message: 'Name query parameter is required' });
    }
    const regex = new RegExp(`^${searchTerm}$`, 'i');
    const food = await Food.findOne({ name: { $regex: regex } });
    if (!food) {
      return res.status(404).json({ message: 'No foods found matching your search' });
    }
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET food by ID
router.get('/:id', async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add new food with image upload
router.post('/addfoods', upload.single('imageUrl'), async (req, res) => {
  try {
    const parseKeyValueString = (str) => {
      if (!str) return {};
      return str.split(',').reduce((map, pair) => {
        const [key, value] = pair.split(':').map(s => s.trim());
        if (key && value) map[key] = value;
        return map;
      }, {});
    };

    const vitaminsMap = parseKeyValueString(req.body.vitamins);
    const mineralsMap = parseKeyValueString(req.body.minerals);

    const foodData = {
      name: req.body.name,
      calories: Number(req.body.calories),
      protein: Number(req.body.protein),
      carbohydrates: Number(req.body.carbohydrates),
      fat: Number(req.body.fat),
      fiber: Number(req.body.fiber) || 0,
      sugar: Number(req.body.sugar) || 0,
      saturatedFat: Number(req.body.saturatedFat) || 0,
      unsaturatedFat: Number(req.body.unsaturatedFat) || 0,
      vitamins: vitaminsMap,
      minerals: mineralsMap,
      category: req.body.category || 'other',
      imageUrl: req.file ? `/uploads/${req.file.filename}` : ''
    };

    const food = new Food(foodData);
    const newFood = await food.save();
    res.status(201).json(newFood);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PATCH update food by ID
router.patch('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json(food);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE food by ID
router.delete('/:id', async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) {
      return res.status(404).json({ message: 'Food not found' });
    }
    res.json({ message: 'Food deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
