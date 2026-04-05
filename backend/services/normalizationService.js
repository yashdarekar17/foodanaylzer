/**
 * Normalizes nutritional data from various sources (JSON, API, AI).
 * Automatically adds health-based tags and standardizes fields.
 */
function normalizeFoodData(rawData, source = 'unknown') {
  const normalized = {
    name: rawData.name?.toLowerCase() || 'unknown food',
    calories: Number(rawData.calories) || 0,
    protein: Number(rawData.protein) || 0,
    fat: Number(rawData.fat) || 0,
    carbohydrates: Number(rawData.carbohydrates || rawData.carbs) || 0,
    fiber: Number(rawData.fiber) || 0,
    sugar: Number(rawData.sugar) || 0,
    category: rawData.category || 'other',
    source: rawData.source || source,
    estimated: rawData.estimated || (source === 'ai'),
    tags: rawData.tags || []
  };

  // Auto-tagging logic based on thresholds
  if (normalized.fat > 20) normalized.tags.push('high_fat');
  if (normalized.carbohydrates > 40) normalized.tags.push('high_carb');
  if (normalized.sugar > 15) normalized.tags.push('high_sugar');
  if (normalized.protein > 15) normalized.tags.push('protein_rich');
  if (normalized.fiber > 5) normalized.tags.push('high_fiber');
  if (normalized.calories > 500) normalized.tags.push('high_calorie');

  // Remove duplicate tags
  normalized.tags = [...new Set(normalized.tags)];

  return normalized;
}

module.exports = { normalizeFoodData };
