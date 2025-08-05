const express = require('express');
const router = express.Router();
const Food = require("../models/food");
const User = require("../models/User")
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {jwtauthentication,genratetoken} = require('../jwt');
const axios = require('axios')


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
router.get("/", jwtauthentication, async (req, res) => {
  try {
    const foods = await Food.find();
    console.log("Fetched foods:", foods);  
    res.json(foods);
  } catch (err) {
    console.error("Error fetching foods:", err);  
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
    // Helper to parse "key:value,key:value" strings
    const parseKeyValueString = (str) => {
  if (!str || typeof str !== 'string') return {};
  return str.split(',').reduce((map, pair) => {
    const [key, value] = pair.split(':').map(s => s.trim());
    if (key && value) map[key] = value;
    return map;
  }, {});
};


    const vitaminsMap = parseKeyValueString(req.body.vitamins);
    const mineralsMap = parseKeyValueString(req.body.minerals);

    const userId = req.body.userId; // ⬅️ Make sure this is sent from frontend or Postman
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

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
      imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
      userId: userId // ✅ Add userId to the food document
    };

    const food = new Food(foodData);
    const newFood = await food.save();

    user.Foods.push(newFood._id); // ✅ Link food to user
    await user.save();

    res.status(201).json(newFood);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
});

router.get('/userfoods/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate('Foods');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user.Foods || []);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/user/:id', jwtauthentication, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
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

router.post('/signup', async (req, res) => {
  try {
    const user = req.body;
    const newUser = new User(user);
    const savedUser = await newUser.save();
    const token =genratetoken({id: savedUser._id, email:savedUser.email, name:savedUser.name});
   
    res.status(200).json({
      user: {
        id: savedUser._id,
        email: savedUser.email,
        name: savedUser.name, 
      },
      token
    });
    console.log(savedUser,"token:",token);
  } catch (err) {
    res.status(500).json({ message: err.message });
    console.log(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, Password  } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isMatch = await user.comparePassword(Password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    const token = genratetoken({ id: user._id, email: user.email, name: user.name });

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message });
  }
});

// router.post('/analyze', upload.single('image'), async (req, res) => {
//   try {
//     const imgFile = req.file;

    
//     const foodLabel = "chicken biryani";

//     const spoonacularApiKey = process.env.YOUR_SPOONACULAR_API_KEY; 
//     const apiUrl = `https://api.spoonacular.com/recipes/guessNutrition?title=${encodeURIComponent(foodLabel)}&apiKey=${spoonacularApiKey}`;
    
//     const response = await axios.get(apiUrl);
//     const nutrientsData = response.data;

    
//     const nutrients = {
//       calories: nutrientsData.calories || { value: 0, unit: "kcal" },
//       protein: nutrientsData.protein || { value: 0, unit: "g" },
//       carbs: nutrientsData.carbs || { value: 0, unit: "g" },
//       fat: nutrientsData.fat || { value: 0, unit: "g" },
//     };

  
//     const warnings = [];
//     if (nutrients.calories.value > 700) warnings.push("High in calories.");
//     if (nutrients.fat.value > 25) warnings.push("High in fat.");
//     if (nutrients.carbs.value > 80) warnings.push("High in carbs.");
//     if (nutrients.protein.value < 10) warnings.push("Low in protein.");

//     res.json({
//       food: foodLabel,
//       nutrients,
//       warnings
//     });

//     fs.unlinkSync(imgFile.path);
//   } catch (err) {
//     console.error("Analyze Error:", err.message);
//     res.status(500).json({ error: 'Error analyzing image' });
//   }
// });


module.exports = router;
 