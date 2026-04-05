const express = require('express');
const router = express.Router();
const Food = require("../models/food");
const User = require("../models/User")
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {jwtauthentication,genratetoken} = require('../jwt');
const axios = require('axios');
const mongoose = require('mongoose');

// NutriScan services
const { getNutrition } = require('../services/nutritionService');
const { calculateRiskScore } = require('../services/riskCalculator');
const { analyzePersonalHealth } = require('../services/healthService');
const { getAlternatives } = require('../services/alternativeService');
const { parseFoodInput, parseMealInput, getFoodExplanation } = require('../services/aiService');
const { getHealthCoachInsight } = require('../services/healthInsightService');
const FoodLog = require('../models/FoodLog');
const MealLog = require('../models/MealLog');


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



// PATCH update user health profile (goal + conditions)
router.patch('/profile/:userId', async (req, res) => {
  try {
    const { goal, conditions } = req.body;
    const user = await User.findByIdAndUpdate(
      req.params.userId,
      { 
        goal: goal || 'maintenance',
        conditions 
      },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Profile updated', goal: user.goal, conditions: user.conditions });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH onboarding — complete user profile with flexible height parsing
router.patch('/profile/onboarding/:userId', async (req, res) => {
  try {
    const { age, gender, weight, heightInput, activity, goal, conditions } = req.body;
    console.log(`[Onboarding] Receiving data for user ${req.params.userId}:`, { age, goal, conditions });

    // Flexible Height Parser: 5'11", 5 11, 5ft 11 (Only match if first digit is 1-9 and it's a stand-alone digit)
    const parseHeight = (h) => {
      if (!h) return 0;
      h = h.toString().toLowerCase().trim();

      // Case 1: 5'11", 5 11, 5"11 (Match single digit 1-9 as feet)
      const ftInMatch = h.match(/^([1-9])\s*(?:'|ft|feet|")?\s*(\d+)?\s*(?:"|in|inches)?$/);
      if (ftInMatch) {
        const ft = parseInt(ftInMatch[1]);
        const inc = parseInt(ftInMatch[2] || 0);
        return Math.round((ft * 30.48) + (inc * 2.54));
      }

      // Case 2: 175cm, 165
      const cmMatch = h.match(/^(\d{2,3})\s*(?:cm|centimeters)?$/);
      if (cmMatch) return parseInt(cmMatch[1]);

      return parseInt(h) || 0;
    };

    const height = parseHeight(heightInput);

    const updateData = {
      age: Number(age),
      gender,
      weight: Number(weight),
      height,
      activity,
      goal,
      conditions: conditions || [],
      isProfileComplete: true
    };

    const user = await User.findByIdAndUpdate(req.params.userId, updateData, { new: true });
    if (!user) return res.status(404).json({ message: 'User not found' });

    console.log(`[Onboarding] Successfully updated user:`, { name: user.name, conditions: user.conditions });
    res.json({ message: 'Onboarding complete!', user });
  } catch (err) {
    console.error(`[Onboarding] Error:`, err.message);
    res.status(500).json({ message: err.message });
  }
});

// GET health insights for the day
router.get('/insights/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    
    if (!user.isProfileComplete) {     
        return res.status(400).json({ message: 'Profile incomplete', setupRequired: true });
    }

    // 1. Calculate Calorie Goal (Mifflin–St Jeor)
    const { weight, height, age, gender, activity, goal } = user;
    let bmr = gender === 'male' 
      ? (10 * weight) + (6.25 * height) - (5 * age) + 5
      : (10 * weight) + (6.25 * height) - (5 * age) - 161;

    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = bmr * (multipliers[activity] || 1.2);
    
    let dailyGoal = Math.round(tdee);
    if (goal === 'weight_loss') dailyGoal -= 500;
    else if (goal === 'weight_gain') dailyGoal += 500;

    // 2. Fetch logs for a specific date or today (Local start/end of day)
    const { date } = req.query;
    let startOfDay, endOfDay;

    if (date) {
      // Create local date range for the requested YYYY-MM-DD
      const [year, month, day] = date.split('-').map(Number);
      startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
      endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);
    } else {
      startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);
      endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);
    }

    const [mealLogs] = await Promise.all([
      MealLog.find({ userId: user._id, date: { $gte: startOfDay, $lte: endOfDay } })
    ]);

    const consumed = mealLogs.reduce((acc, m) => acc + m.totalCalories, 0);

    const macros = {
      protein: mealLogs.reduce((acc, m) => acc + (m.totalProtein || 0), 0),
      fat:     mealLogs.reduce((acc, m) => acc + (m.totalFat || 0), 0),
      carbs:   mealLogs.reduce((acc, m) => acc + (m.totalCarbohydrates || 0), 0)
    };

    // Only show meal logs in Today's Activity
    const allItems = mealLogs.map(m => ({ 
      id: m._id, 
      name: m.mealName, 
      calories: m.totalCalories, 
      type: 'meal', 
      items: m.items, 
      date: m.date 
    })).sort((a, b) => new Date(b.date) - new Date(a.date));

    // 3. Get AI Health Coach Insight
    const insightMessage = await getHealthCoachInsight(
        { dailyGoal, consumed, remaining: dailyGoal - consumed, goalType: goal },
        { name: user.name }
    );

    res.json({
      dailyGoal,
      consumed,
      remaining: dailyGoal - consumed,
      status: consumed > dailyGoal ? 'over' : 'on_track',
      nutritionSummary: {
        protein: Math.round(macros.protein),
        fat: Math.round(macros.fat),
        carbs: Math.round(macros.carbs)
      },
      recentFoods: allItems.slice(0, 20),
      aiInsight: insightMessage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET historical calorie/macro totals (Monday to Sunday, with optional weekOffset)
router.get('/insights/history/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const weekOffset = parseInt(req.query.weekOffset) || 0; // 0 = this week, 1 = last week, etc.
    
    // 1. Calculate Monday of the target week (local time)
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    
    const monday = new Date(now);
    monday.setDate(now.getDate() - diffToMonday - (weekOffset * 7));
    monday.setHours(0, 0, 0, 0);

    // 2. Set range to full 7 days (Mon to Sun)
    const startDate = new Date(monday);
    const endDate = new Date(monday);
    endDate.setDate(monday.getDate() + 7); // Exclusive end (Next Monday 12 AM)

    // Helper to get YYYY-MM-DD in local time
    const getLocalDateString = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const history = await MealLog.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: { $dateToString: { 
            format: "%Y-%m-%d", 
            date: "$date",
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
          } },
          calories: { $sum: "$totalCalories" },
          protein: { $sum: "$totalProtein" },
          fat: { $sum: "$totalFat" },
          carbs: { $sum: "$totalCarbohydrates" },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // 3. Fill in exactly 7 days: MON to SUN
    const weeklyData = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dateStr = getLocalDateString(d);
        
        const existing = history.find(h => h._id === dateStr);
        if (existing) {
            weeklyData.push({
                date: dateStr,
                calories: Math.round(existing.calories),
                protein: Math.round(existing.protein),
                fat: Math.round(existing.fat),
                carbs: Math.round(existing.carbs),
                label: d.toLocaleDateString('en-US', { weekday: 'short' })
            });
        } else {
            weeklyData.push({
                date: dateStr,
                calories: 0,
                protein: 0,
                fat: 0,
                carbs: 0,
                label: d.toLocaleDateString('en-US', { weekday: 'short' })
            });
        }
    }

    res.json(weeklyData);
  } catch (err) {
    console.error("History Error:", err);
    res.status(500).json({ message: err.message });
  }
});

// DELETE a specific food log entry
router.delete('/logs/:logId', async (req, res) => {
  try {
    const log = await FoodLog.findByIdAndDelete(req.params.logId);
    if (!log) return res.status(404).json({ message: 'Log entry not found.' });
    res.json({ message: 'Log entry deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST parse meal description into items
router.post('/meals/parse', async (req, res) => {
  console.log(`[MEAL_PARSE] Received request for text: "${req.body.text}"`);
  try {
    const { text, userId } = req.body;
    if (!text) {
      console.warn("[MEAL_PARSE] No text provided.");
      return res.status(400).json({ message: 'No meal description provided.' });
    }

    console.log("[MEAL_PARSE] Calling parseMealInput...");
    const parsed = await parseMealInput(text);
    console.log("[MEAL_PARSE] AI Result:", JSON.stringify(parsed));
    
    const items = parsed.items || [];
    if (items.length === 0) {
        console.warn("[MEAL_PARSE] AI returned 0 items.");
    }
    
    console.log(`[MEAL_PARSE] Fetching nutrition for ${items.length} items...`);
    const enrichedItems = await Promise.all(items.map(async (item, index) => {
      try {
        console.log(`[MEAL_PARSE] Item ${index+1}: "${item.food}" (Qty: ${item.quantity})`);
        const nutrition = await getNutrition(item.food, userId);
        const q = item.quantity || 1;
        
        if (!nutrition) {
          console.log(`[MEAL_PARSE] ! No nutrition found for "${item.food}", using fallback.`);
          return {
            foodName: item.food,
            quantity: q,
            calories: 0,
            protein: 0,
            fat: 0,
            carbohydrates: 0,
            estimated: true,
            notFound: true
          };
        }

        console.log(`[MEAL_PARSE] ✓ Found nutrition for "${item.food}": ${nutrition.calories} kcal`);
        return {
          foodName: nutrition.name,
          quantity: q,
          calories: Math.round(nutrition.calories * q),
          protein: Math.round(nutrition.protein * q * 10) / 10,
          fat: Math.round(nutrition.fat * q * 10) / 10,
          carbohydrates: Math.round(nutrition.carbohydrates * q * 10) / 10,
          estimated: nutrition.estimated || false
        };
      } catch (innerErr) {
        console.error(`[MEAL_PARSE] Error processing item "${item.food}":`, innerErr.message);
        return { foodName: item.food, quantity: 1, calories: 0, estimated: true, error: true };
      }
    }));

    console.log("[MEAL_PARSE] Calculating totals...");
    const totals = enrichedItems.reduce((acc, curr) => ({
      calories: acc.calories + (curr.calories || 0),
      protein: acc.protein + (curr.protein || 0),
      fat: acc.fat + (curr.fat || 0),
      carbohydrates: acc.carbohydrates + (curr.carbohydrates || 0)
    }), { calories: 0, protein: 0, fat: 0, carbohydrates: 0 });

    console.log("[MEAL_PARSE] Success! Returning preview.");
    res.json({
      originalText: text,
      items: enrichedItems,
      totals
    });
  } catch (err) {
    console.error("[MEAL_PARSE] FATAL ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

// POST save confirmed meal
router.post('/meals/save', async (req, res) => {
  try {
    const { userId, mealData } = req.body;
    const newMeal = new MealLog({
      userId,
      originalText: mealData.originalText,
      items: mealData.items,
      totalCalories: mealData.totals.calories,
      totalProtein: mealData.totals.protein,
      totalFat: mealData.totals.fat,
      totalCarbohydrates: mealData.totals.carbohydrates
    });
    await newMeal.save();
    res.json({ message: 'Meal logged successfully!', meal: newMeal });
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


// ============================================================
// POST /foods/analyze — Core NutriScan Analysis Endpoint
// ============================================================
router.post('/analyze', async (req, res) => {
  try {
    const { foodText, userId } = req.body;

    if (!foodText || !foodText.trim()) {
      return res.status(400).json({ message: 'Food text is required.' });
    }

    // STEP 1: Parse natural language input using Groq AI
    const parsed = await parseFoodInput(foodText);
    const primaryFood = parsed.food || foodText.toLowerCase();

    // STEP 2: Lookup nutrition through the 4-layer system
    const extras = parsed.extras || [];
    let nutritionData;
    let combinedName = primaryFood;

    if (extras.length > 0) {
      // When extras are present (e.g. "butter", "sunflower oil"), estimate the
      // COMBINED nutrition of food + extras together for accuracy.
      combinedName = `${primaryFood} with ${extras.join(' and ')}`;
      console.log(`[Analyze] Extras detected — estimating combined: "${combinedName}"`);
      const { estimateNutrition } = require('../services/aiService');
      const aiResult = await estimateNutrition(combinedName);
      if (aiResult) {
        const { normalizeFoodData } = require('../services/normalizationService');
        nutritionData = normalizeFoodData({ ...aiResult, source: 'ai', estimated: true }, 'ai');
      }
    }

    // Fall back to the standard 4-layer lookup if no extras or AI failed
    if (!nutritionData) {
      nutritionData = await getNutrition(primaryFood, userId);
    }

    if (!nutritionData) {
      return res.status(404).json({ message: `Could not find or estimate nutrition for "${primaryFood}". Please try a different food.` });
    }

    // Use the combined name if extras were present
    nutritionData.name = extras.length > 0 ? combinedName : nutritionData.name;

    // Scale by quantity if more than 1 serving
    const quantity = parsed.quantity || 1;
    const scaled = { ...nutritionData };
    if (quantity > 1) {
      scaled.calories = Math.round(nutritionData.calories * quantity);
      scaled.protein  = Math.round(nutritionData.protein  * quantity * 10) / 10;
      scaled.fat      = Math.round(nutritionData.fat      * quantity * 10) / 10;
      scaled.carbohydrates = Math.round(nutritionData.carbohydrates * quantity * 10) / 10;
      scaled.fiber    = Math.round(nutritionData.fiber    * quantity * 10) / 10;
      scaled.sugar    = Math.round(nutritionData.sugar    * quantity * 10) / 10;
    }

    // STEP 3: Calculate risk score — fetch user conditions first so score is condition-aware
    let userConditionsForRisk = [];
    let _userForHealth = null;

    if (userId) {
      try {
        _userForHealth = await User.findById(userId);
        if (_userForHealth && _userForHealth.conditions) {
          userConditionsForRisk = Array.isArray(_userForHealth.conditions)
            ? _userForHealth.conditions
            : [_userForHealth.conditions];
        }
      } catch (err) {
        console.error('Could not pre-load user for risk calc:', err.message);
      }
    }

    const { riskScore, status } = calculateRiskScore(scaled, userConditionsForRisk);

    // STEP 4: Personalized health check (if user is logged in)
    let personalHealth = [];
    let profileSetup = false;

    if (userId && _userForHealth) {
      try {
        const user = _userForHealth;
        const hasGoal       = user.goal && user.goal !== 'maintenance';
        const hasConditions = user.conditions && user.conditions.length > 0;

        if (!hasGoal && !hasConditions) {
          personalHealth = [{ type: 'setup', message: 'Set up your health profile to get personalized recommendations.' }];
        } else {
          profileSetup = true;
          const userProfile = {
            goal: user.goal || 'maintenance',
            conditions: user.conditions || []
          };
          const results = analyzePersonalHealth(scaled, userProfile);
          personalHealth = results.map(msg => ({ type: 'result', message: msg }));
        }
      } catch (err) {
        console.error('Could not load user profile:', err.message);
      }
    } else if (userId && !_userForHealth) {
      // userId provided but user not found
    }

    // STEP 5: Get smart alternatives
    const alternatives = getAlternatives(primaryFood);

    // STEP 6: Generate AI explanation (personalized if user is logged in)
    const explanationUserProfile = _userForHealth
      ? { goal: _userForHealth.goal || null, conditions: _userForHealth.conditions || [] }
      : null;

    const explanation = await getFoodExplanation(
      { name: scaled.name, calories: scaled.calories, protein: scaled.protein, fat: scaled.fat, carbohydrates: scaled.carbohydrates, riskScore, status },
      explanationUserProfile
    );

    // STEP 7: Build and return final response
    const response = {
      food: scaled.name,
      quantity,
      extras: parsed.extras || [],
      calories: scaled.calories,
      protein: scaled.protein,
      fat: scaled.fat,
      carbohydrates: scaled.carbohydrates,
      fiber: scaled.fiber,
      sugar: scaled.sugar,
      category: scaled.category,
      tags: scaled.tags,
      riskScore,
      status,
      source: scaled.source,
      estimated: scaled.estimated || false,
      explanation,
      personalHealth,
      alternatives
    };

    // STEP 8: Automatic Food Logging (DISABLED: Only AI Quick Add meals are logged now)
    /*
    if (userId) {
      try {
        await FoodLog.create({
          userId,
          foodName: scaled.name,
          calories: scaled.calories,
          protein: scaled.protein,
          fat: scaled.fat,
          carbohydrates: scaled.carbohydrates
        });
        console.log(`[Logging] Automatically saved "${scaled.name}" to user logs.`);
      } catch (logErr) {
        console.error('Auto-logging error:', logErr.message);
      }
    }
    */

    res.json(response);
  } catch (err) {
    console.error('Analyze error:', err);
    res.status(500).json({ message: 'Internal server error during analysis.' });
  }
});


module.exports = router;