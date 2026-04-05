const path = require('path');
const fs = require('fs');
const axios = require('axios');
const Food = require('../models/food');
const { estimateNutrition } = require('./aiService');
const { normalizeFoodData } = require('./normalizationService');

// Load the read-only JSON dataset once at startup
const DATA_PATH = path.join(__dirname, '../data/foodData.json');
const foodDataset = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

/**
 * TIER 1: Look up food in the local read-only JSON dataset.
 */
function lookupInDataset(foodName) {
  const query = foodName.toLowerCase().trim();

  // Strict exact match only — "chicken fry" will NOT match "chicken" in the dataset
  const result = foodDataset.find(item => item.name.toLowerCase() === query);

  if (!result) return null;

  return normalizeFoodData({
    ...result,
    carbohydrates: result.carbs,
    source: 'dataset'
  }, 'dataset');
}

/**
 * TIER 2: Look up food in MongoDB cache (previously AI/API results).
 */
async function lookupInCache(foodName) {
  try {
    const query = new RegExp(`^${foodName.trim()}$`, 'i');
    const cached = await Food.findOne({
      name: { $regex: query },
      source: { $in: ['ai', 'api'] }
    });

    if (!cached) return null;

    return normalizeFoodData({
      ...cached.toObject(),
      carbohydrates: cached.carbohydrates
    });
  } catch (err) {
    console.error("Cache lookup error:", err);
    return null;
  }
}

/**
 * TIER 3: Fetch from Spoonacular API and normalize.
 */
async function lookupFromSpoonacular(foodName) {
  try {
    const apiKey = process.env.SPOONACULAR_API;
    const url = `https://api.spoonacular.com/recipes/guessNutrition?title=${encodeURIComponent(foodName)}&apiKey=${apiKey}`;
    const response = await axios.get(url, { timeout: 8000 });
    const data = response.data;

    if (!data || !data.calories) return null;

    // Fetch AI estimate to fill in missing fields (sugar, fiber, category)
    const estimate = await estimateNutrition(foodName);

    const raw = {
      name: foodName,
      calories: data.calories?.value || 0,
      protein: data.protein?.value || 0,
      fat: data.fat?.value || 0,
      carbohydrates: data.carbs?.value || 0,
      fiber: estimate?.fiber || 0,
      sugar: estimate?.sugar || 0,
      category: estimate?.category || 'other',
      source: 'api'
    };

    return normalizeFoodData(raw, 'api');
  } catch (err) {
    console.error("Spoonacular API error:", err.message);
    return null;
  }
}

/**
 * TIER 4: Estimate nutrition using Groq AI and save to MongoDB.
 */
async function lookupFromAI(foodName, userId) {
  try {
    const aiResult = await estimateNutrition(foodName);
    if (!aiResult) return null;

    const normalized = normalizeFoodData({
      ...aiResult,
      source: 'ai',
      estimated: true
    }, 'ai');

    // Cache the AI result to MongoDB for future lookups
    const existingCache = await Food.findOne({ name: new RegExp(`^${foodName}$`, 'i') });
    if (!existingCache) {
      await Food.create({
        ...normalized,
        userId: userId || null
      });
    }

    return normalized;
  } catch (err) {
    console.error("AI fallback error:", err);
    return null;
  }
}

/**
 * Main orchestrator: Runs all tiers in sequence.
 */
async function getNutrition(foodName, userId = null) {
  console.log(`[NutritionService] Searching: "${foodName}"`);

  // Tier 1: Local JSON Dataset
  const fromDataset = lookupInDataset(foodName);
  if (fromDataset) {
    console.log(`[NutritionService] Found in dataset`);
    return fromDataset;
  }

  // Tier 2: MongoDB Cache (AI/API results from previous searches)
  const fromCache = await lookupInCache(foodName);
  if (fromCache) {
    console.log(`[NutritionService] Found in MongoDB cache`);
    return fromCache;
  }

  // Tier 3: Spoonacular API
  const fromSpoonacular = await lookupFromSpoonacular(foodName);
  if (fromSpoonacular) {
    console.log(`[NutritionService] Found via Spoonacular API`);
    return fromSpoonacular;
  }

  // Tier 4: Groq AI Estimation (Last resort)
  console.log(`[NutritionService] Using Groq AI estimation`);
  const fromAI = await lookupFromAI(foodName, userId);
  return fromAI;
}

module.exports = { getNutrition };
