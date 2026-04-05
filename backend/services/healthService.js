/**
 * Personalization service — handles free-text goals and conditions
 * using keyword matching instead of fixed enum values.
 */

// ── Keyword maps ───────────────────────────────────────────────────────────
const GOAL_KEYWORDS = {
  weight_loss:     ['weight loss', 'lose weight', 'fat loss', 'slim', 'cut', 'diet'],
  weight_gain:     ['weight gain', 'gain weight', 'bulk', 'bulking'],
  muscle_building: ['muscle', 'strength', 'gym', 'build', 'protein', 'bodybuilding'],
};

const CONDITION_KEYWORDS = {
  diabetes:            ['diabetes', 'diabetic', 'sugar', 'blood sugar', 'type 2', 'type2'],
  high_bp:             ['blood pressure', 'hypertension', 'bp', 'high bp'],
  lactose_intolerance: ['lactose', 'dairy intolerance', 'milk allergy', 'milk intolerance'],
  cholesterol:         ['cholesterol', 'lipid', 'ldl', 'triglyceride'],
  thyroid:             ['thyroid', 'hypothyroid', 'hyperthyroid'],
  acid_reflux:         ['acid reflux', 'gerd', 'heartburn', 'acidity', 'gastritis', 'acid', 'reflux'],
  ibs:                 ['ibs', 'irritable bowel', 'irritable bowel syndrome', 'bloating', 'gut issue', 'colitis'],
  kidney_disease:      ['kidney', 'renal', 'ckd', 'kidney disease', 'kidney failure'],
  gout:                ['gout', 'uric acid', 'high uric'],
  pcos:                ['pcos', 'pcod', 'polycystic ovary', 'polycystic ovarian'],
  celiac:              ['celiac', 'coeliac', 'gluten intolerance', 'gluten allergy', 'gluten free'],
  fatty_liver:         ['fatty liver', 'liver disease', 'nafld', 'nash', 'liver problem'],
  anemia:              ['anemia', 'anaemia', 'iron deficiency', 'low iron', 'low hemoglobin'],
  osteoporosis:        ['osteoporosis', 'bone density', 'calcium deficiency', 'weak bones'],
};

// ── Spicy / trigger food name keywords for acid reflux ───────────────────
const SPICY_TRIGGERS = [
  'chili', 'chilli', 'spicy', 'curry', 'masala', 'pepper', 'hot sauce',
  'sriracha', 'jalapeño', 'jalapeno', 'vindaloo', 'schezwan', 'szechuan',
  'tikka', 'tandoori', 'mirchi', 'sambal', 'harissa', 'buffalo', 'red curry',
  'green curry', 'thai curry', 'peri peri', 'peri-peri'
];

const ACIDIC_FOOD_TRIGGERS = [
  'tomato', 'orange', 'lemon', 'lime', 'grapefruit', 'pineapple',
  'vinegar', 'tamarind', 'imli', 'amla', 'gooseberry', 'ketchup',
  'tomato sauce', 'salsa'
];

const HIGH_FAT_REFLUX_TRIGGERS = [
  'fried', 'deep fried', 'french fries', 'burger', 'pizza', 'butter chicken',
  'biryani', 'cheese', 'cream', 'ghee', 'butter', 'coconut milk'
];

const PURINE_HIGH_FOODS = [
  'red meat', 'beef', 'mutton', 'lamb', 'organ meat', 'liver', 'kidney',
  'sardine', 'anchovies', 'mackerel', 'herring', 'shellfish', 'shrimp', 'prawn',
  'crab', 'alcohol', 'beer', 'yeast'
];

const HIGH_FIBER_IBS_TRIGGERS = [
  'cabbage', 'broccoli', 'cauliflower', 'onion', 'garlic', 'bean',
  'chickpea', 'chana', 'rajma', 'kidney bean', 'lentil', 'dal',
  'apple', 'pear', 'watermelon', 'mango', 'wheat', 'rye'
];

const HIGH_POTASSIUM_FOODS = [
  'banana', 'avocado', 'potato', 'tomato', 'orange', 'apricot',
  'spinach', 'pomegranate', 'coconut water', 'dried fruit', 'nuts'
];

const HIGH_PHOSPHORUS_FOODS = [
  'dairy', 'cheese', 'milk', 'paneer', 'yogurt', 'curd', 'nuts',
  'seeds', 'whole grain', 'bran', 'dark cola', 'processed meat'
];

const GLUTEN_FOODS = [
  'bread', 'roti', 'naan', 'pasta', 'wheat', 'noodles', 'biscuit',
  'cake', 'cookie', 'flour tortilla', 'atta', 'maida', 'semolina', 'rava',
  'barley', 'rye', 'oats', 'chapati', 'puri', 'bhatura', 'paratha'
];

const HIGH_FAT_LIVER_TRIGGERS = [
  'fried', 'deep fried', 'butter', 'ghee', 'cream', 'cheese', 'red meat',
  'processed meat', 'alcohol', 'pastry', 'dessert', 'sweet', 'refined'
];

// ── Helper: keyword matcher ───────────────────────────────────────────────
function matchKeyword(text, keywordMap) {
  if (!text) return null;
  const lower = text.toLowerCase();
  for (const [key, keywords] of Object.entries(keywordMap)) {
    if (keywords.some(kw => lower.includes(kw))) return key;
  }
  return null;
}

/** Check if a food name contains any trigger from a list */
function nameContainsTrigger(name, triggers) {
  const lower = (name || '').toLowerCase();
  return triggers.some(t => lower.includes(t));
}

// ── Main analysis function ────────────────────────────────────────────────
function analyzePersonalHealth(foodData, userProfile) {
  const feedback = [];
  const { goal, conditions } = userProfile;
  const foodName = (foodData.name || '').toLowerCase();

  // ── Goal logic ─────────────────────────────────────────────────────────
  const matchedGoal = matchKeyword(goal, GOAL_KEYWORDS);

  if (matchedGoal === 'weight_loss') {
    if (foodData.calories > 400) feedback.push('⚠️ High in calories — may slow weight loss.');
    if (foodData.fat > 20)       feedback.push('⚠️ High in fat (not ideal for weight loss).');
    if (foodData.fiber > 5)      feedback.push('✅ Good fiber content — helps with satiety.');
  } else if (matchedGoal === 'weight_gain' || matchedGoal === 'muscle_building') {
    if (foodData.protein > 15) feedback.push('✅ Excellent protein source for muscle building.');
    if (foodData.protein < 5)  feedback.push('⚠️ Low protein — consider adding a protein side.');
    if (foodData.calories > 400) feedback.push('✅ Good calorie density for weight gain.');
  }

  // ── Condition logic ────────────────────────────────────────────────────
  const allConditions = Array.isArray(conditions) ? conditions : [conditions].filter(Boolean);

  for (const condText of allConditions) {
    const matched = matchKeyword(condText, CONDITION_KEYWORDS);

    // ── Diabetes ─────────────────────────────────────────────────────────
    if (matched === 'diabetes') {
      if (foodData.sugar > 10)         feedback.push('🚨 Risky: High sugar — not suitable for diabetics.');
      if (foodData.carbohydrates > 40) feedback.push('🚨 Risky: High carbs may spike blood sugar.');
      if (foodData.fiber > 5)          feedback.push('✅ Good fiber helps moderate blood sugar spikes.');
    }

    // ── High Blood Pressure ───────────────────────────────────────────────
    if (matched === 'high_bp') {
      const isProcessed = ['fast_food', 'street_food', 'processed'].includes(foodData.category);
      if (isProcessed) feedback.push('🚨 Risky: Likely high in sodium — avoid for blood pressure management.');
      if (nameContainsTrigger(foodName, ['pickle', 'papad', 'chips', 'namkeen', 'canned', 'salted', 'salty']))
        feedback.push('🚨 High sodium food — not suitable for hypertension.');
      if (foodData.fat > 20) feedback.push('⚠️ High fat content can contribute to high blood pressure.');
    }

    // ── Cholesterol ───────────────────────────────────────────────────────
    if (matched === 'cholesterol') {
      if (foodData.fat > 20)          feedback.push('🚨 High fat content — not ideal for high cholesterol.');
      if (foodData.saturatedFat > 5)  feedback.push('🚨 Saturated fat raises LDL cholesterol levels.');
      if (foodData.fiber > 5)         feedback.push('✅ Fiber helps lower cholesterol naturally.');
      if (nameContainsTrigger(foodName, ['egg yolk', 'red meat', 'mutton', 'beef', 'organ', 'liver', 'butter', 'ghee', 'cream']))
        feedback.push('⚠️ This food may elevate cholesterol — consume in moderation.');
    }

    // ── Lactose Intolerance ───────────────────────────────────────────────
    if (matched === 'lactose_intolerance') {
      if (nameContainsTrigger(foodName, ['milk', 'dairy', 'cheese', 'paneer', 'butter', 'curd', 'lassi', 'kheer', 'rabdi', 'cream', 'yogurt', 'ice cream', 'whey']))
        feedback.push('🚨 Risky: Contains dairy — may cause issues with lactose intolerance.');
    }

    // ── Acid Reflux / GERD / Acidity / Gastritis ─────────────────────────
    if (matched === 'acid_reflux') {
      let refluxWarnings = [];

      if (nameContainsTrigger(foodName, SPICY_TRIGGERS))
        refluxWarnings.push('🚨 Risky: Spicy food is a major acid reflux trigger — can worsen heartburn and GERD.');

      if (nameContainsTrigger(foodName, ACIDIC_FOOD_TRIGGERS))
        refluxWarnings.push('🚨 Risky: Acidic ingredients (tomato, citrus, vinegar) can trigger acid reflux symptoms.');

      if (nameContainsTrigger(foodName, HIGH_FAT_REFLUX_TRIGGERS) || foodData.fat > 20)
        refluxWarnings.push('⚠️ High fat content slows digestion and can relax the LES, worsening acid reflux.');

      if (nameContainsTrigger(foodName, ['chocolate', 'coffee', 'tea', 'caffeine', 'cola', 'soda', 'carbonated', 'alcohol', 'mint', 'peppermint']))
        refluxWarnings.push('🚨 Risky: This food/drink is a known acid reflux trigger (caffeine, mint, fizzy drinks).');

      if (refluxWarnings.length > 0) {
        refluxWarnings.forEach(w => feedback.push(w));
      } else {
        feedback.push('✅ Generally safe for acid reflux — mild, non-spicy, low-acid food.');
      }
    }

    // ── IBS / Irritable Bowel Syndrome ────────────────────────────────────
    if (matched === 'ibs') {
      if (nameContainsTrigger(foodName, HIGH_FIBER_IBS_TRIGGERS))
        feedback.push('🚨 Risky: This food contains high-FODMAP ingredients that can trigger IBS symptoms (bloating, cramping).');
      if (nameContainsTrigger(foodName, SPICY_TRIGGERS))
        feedback.push('⚠️ Spicy food can worsen IBS symptoms — consume with caution.');
      if (foodData.fat > 20)
        feedback.push('⚠️ High fat content can stimulate gut contractions in IBS patients.');
    }

    // ── Kidney Disease ────────────────────────────────────────────────────
    if (matched === 'kidney_disease') {
      if (nameContainsTrigger(foodName, HIGH_POTASSIUM_FOODS))
        feedback.push('🚨 Risky: High-potassium food — may be harmful with kidney disease (can cause hyperkalemia).');
      if (nameContainsTrigger(foodName, HIGH_PHOSPHORUS_FOODS))
        feedback.push('🚨 Risky: High-phosphorus food — kidneys may struggle to filter excess phosphorus.');
      if (foodData.protein > 20)
        feedback.push('⚠️ High protein can put extra strain on damaged kidneys.');
    }

    // ── Gout ──────────────────────────────────────────────────────────────
    if (matched === 'gout') {
      if (nameContainsTrigger(foodName, PURINE_HIGH_FOODS))
        feedback.push('🚨 Risky: High-purine food — can raise uric acid levels and trigger gout attacks.');
      if (nameContainsTrigger(foodName, ['alcohol', 'beer', 'wine', 'fructose', 'soft drink', 'soda', 'juice']))
        feedback.push('🚨 This drink increases uric acid — avoid with gout.');
    }

    // ── PCOS ──────────────────────────────────────────────────────────────
    if (matched === 'pcos') {
      if (foodData.sugar > 10 || foodData.carbohydrates > 50)
        feedback.push('🚨 High glycemic food — may worsen insulin resistance in PCOS.');
      if (nameContainsTrigger(foodName, ['fried', 'fast food', 'processed', 'white rice', 'white bread', 'maida']))
        feedback.push('⚠️ Processed/refined carbs can spike insulin levels, worsening PCOS symptoms.');
      if (foodData.fiber > 5)
        feedback.push('✅ Good fiber content helps manage insulin levels in PCOS.');
    }

    // ── Celiac / Gluten Intolerance ───────────────────────────────────────
    if (matched === 'celiac') {
      if (nameContainsTrigger(foodName, GLUTEN_FOODS))
        feedback.push('🚨 Risky: Contains gluten — not safe for celiac disease or gluten intolerance.');
    }

    // ── Fatty Liver ───────────────────────────────────────────────────────
    if (matched === 'fatty_liver') {
      if (nameContainsTrigger(foodName, HIGH_FAT_LIVER_TRIGGERS) || foodData.fat > 20)
        feedback.push('🚨 Risky: High fat content can worsen fatty liver disease (NAFLD).');
      if (foodData.sugar > 15 || nameContainsTrigger(foodName, ['sweet', 'dessert', 'sugar', 'candy', 'soda', 'juice']))
        feedback.push('🚨 High sugar/fructose accelerates fat accumulation in the liver.');
    }

    // ── Anemia ────────────────────────────────────────────────────────────
    if (matched === 'anemia') {
      if (nameContainsTrigger(foodName, ['spinach', 'palak', 'lentil', 'dal', 'red meat', 'liver', 'beans', 'tofu', 'fortified']))
        feedback.push('✅ Good iron source — beneficial for anemia.');
      if (nameContainsTrigger(foodName, ['tea', 'coffee', 'calcium', 'dairy']))
        feedback.push('⚠️ Tea, coffee, and dairy can inhibit iron absorption — avoid consuming with iron-rich meals.');
    }

    // ── Osteoporosis ──────────────────────────────────────────────────────
    if (matched === 'osteoporosis') {
      if (nameContainsTrigger(foodName, ['milk', 'dairy', 'cheese', 'yogurt', 'curd', 'paneer', 'tofu', 'calcium']))
        feedback.push('✅ Good calcium source — beneficial for bone density.');
      if (nameContainsTrigger(foodName, ['alcohol', 'soda', 'cola', 'caffeine', 'salt', 'processed']))
        feedback.push('⚠️ This can reduce calcium absorption or accelerate bone loss.');
    }

    // ── Thyroid ───────────────────────────────────────────────────────────
    if (matched === 'thyroid') {
      if (nameContainsTrigger(foodName, ['cabbage', 'broccoli', 'cauliflower', 'kale', 'soy', 'tofu', 'radish', 'turnip', 'millet', 'bajra']))
        feedback.push('⚠️ Caution: This food may interfere with thyroid function (goitrogenic food).');
      if (nameContainsTrigger(foodName, ['iodine', 'seaweed', 'fish', 'egg', 'dairy']))
        feedback.push('✅ Contains iodine/selenium — supports thyroid health.');
    }
  }

  // ── Fallback ───────────────────────────────────────────────────────────
  if (feedback.length === 0) {
    feedback.push('✅ Suitable for your profile in moderation.');
  }

  return feedback;
}

/**
 * Returns a risk penalty score (0–40) based on health condition conflicts.
 * Used by riskCalculator to make riskScore condition-aware.
 */
function conditionRiskPenalty(foodData, conditions) {
  if (!conditions || conditions.length === 0) return 0;

  let penalty = 0;
  const foodName = (foodData.name || '').toLowerCase();
  const allConditions = Array.isArray(conditions) ? conditions : [conditions].filter(Boolean);

  for (const condText of allConditions) {
    const matched = matchKeyword(condText, CONDITION_KEYWORDS);

    if (matched === 'acid_reflux') {
      if (nameContainsTrigger(foodName, SPICY_TRIGGERS))           penalty += 35;
      if (nameContainsTrigger(foodName, ACIDIC_FOOD_TRIGGERS))     penalty += 20;
      if (nameContainsTrigger(foodName, HIGH_FAT_REFLUX_TRIGGERS) || foodData.fat > 20) penalty += 15;
      if (nameContainsTrigger(foodName, ['coffee', 'alcohol', 'chocolate', 'mint', 'carbonated'])) penalty += 25;
    }

    if (matched === 'diabetes') {
      if (foodData.sugar > 10)         penalty += 25;
      if (foodData.carbohydrates > 50) penalty += 20;
    }

    if (matched === 'high_bp') {
      const isProcessed = ['fast_food', 'street_food'].includes(foodData.category);
      if (isProcessed) penalty += 20;
    }

    if (matched === 'cholesterol') {
      if (foodData.saturatedFat > 5)  penalty += 20;
      if (foodData.fat > 20)          penalty += 15;
    }

    if (matched === 'gout') {
      if (nameContainsTrigger(foodName, PURINE_HIGH_FOODS)) penalty += 30;
    }

    if (matched === 'ibs') {
      if (nameContainsTrigger(foodName, HIGH_FIBER_IBS_TRIGGERS)) penalty += 20;
      if (nameContainsTrigger(foodName, SPICY_TRIGGERS))          penalty += 20;
    }

    if (matched === 'kidney_disease') {
      if (nameContainsTrigger(foodName, HIGH_POTASSIUM_FOODS))   penalty += 25;
      if (nameContainsTrigger(foodName, HIGH_PHOSPHORUS_FOODS))  penalty += 20;
    }

    if (matched === 'fatty_liver') {
      if (foodData.fat > 20)          penalty += 20;
      if (foodData.sugar > 15)        penalty += 20;
    }

    if (matched === 'celiac') {
      if (nameContainsTrigger(foodName, GLUTEN_FOODS)) penalty += 40;
    }

    if (matched === 'lactose_intolerance') {
      if (nameContainsTrigger(foodName, ['milk', 'dairy', 'cheese', 'paneer', 'butter', 'curd', 'lassi', 'cream', 'yogurt', 'ice cream'])) penalty += 30;
    }
  }

  // Cap penalty contribution at 50
  return Math.min(50, penalty);
}

module.exports = { analyzePersonalHealth, conditionRiskPenalty };
