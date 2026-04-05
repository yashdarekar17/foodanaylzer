const { conditionRiskPenalty } = require('./healthService');

/**
 * Calculates a point-based health risk score (0-100) for a food item.
 * If user conditions are provided, the score is boosted based on condition conflicts.
 *
 * @param {Object} foodData - Nutritional data for the food
 * @param {Array}  conditions - (optional) User's health conditions from their profile
 */
function calculateRiskScore(foodData, conditions = []) {
  // Start with a base of 5 points (everyone has a baseline risk)
  let score = 5;

  // 1. Calories (Higher density = higher risk)
  if (foodData.calories > 500) score += 25;
  else if (foodData.calories > 350) score += 15;
  else if (foodData.calories > 250) score += 5;

  // 2. Fat (Saturated fat is higher risk)
  if (foodData.fat > 25) score += 20;
  else if (foodData.fat > 15) score += 10;
  
  if (foodData.saturatedFat > 10) score += 15;

  // 3. Sugar (High impact on metabolism)
  if (foodData.sugar > 20) score += 25;
  else if (foodData.sugar > 10) score += 10;

  // 4. Protein (Higher protein reduces risk)
  if (foodData.protein < 5) score += 10;
  else if (foodData.protein > 15) score -= 10;

  // 5. Fiber (Higher fiber reduces risk)
  if (foodData.fiber > 5) score -= 10;

  // 6. Condition-based penalty — boosts score when food conflicts with health conditions
  const penalty = conditionRiskPenalty(foodData, conditions);
  score += penalty;

  // Constrain score between 0 and 100
  const finalScore = Math.max(0, Math.min(100, score));
  let status = "Safe";
  if (finalScore > 70) status = "Risky";
  else if (finalScore >= 40) status = "Moderate";

  return { riskScore: finalScore, status };
}

module.exports = { calculateRiskScore };
