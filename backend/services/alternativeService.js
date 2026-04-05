/**
 * Static mapping of food alternatives.
 * Structured for future AI upgrades.
 */
const alternativesMap = {
  // Fast Food
  "maggi noodles":      ["vegetable poha", "oats", "upma"],
  "veg burger":         ["grilled paneer sandwich", "dal chilla", "dhokla"],
  "chicken burger":     ["grilled chicken wrap", "boiled chicken salad"],
  "pizza (veg)":        ["vegetable roti pizza", "dosa", "uttapam"],
  "pizza (chicken)":    ["chicken tikka wrap", "grilled chicken salad"],
  "french fries":       ["baked sweet potato", "roasted makhana", "salad (mixed veg)"],
  "sabudana khichdi":   ["vegetable poha", "oats"],

  // Street Food
  "vada pav":           ["dhokla", "upma", "moong dal chilla"],
  "pav bhaji":          ["dal tadka with roti", "rajma curry"],
  "samosa":             ["baked kachori", "dhokla", "moong dal chilla"],
  "kachori":            ["dhokla", "vegetable poha"],
  "pani puri":          ["bhel puri", "sprout salad"],
  "dabeli":             ["vegetable poha", "upma"],
  "misal pav":          ["dal tadka", "rajma curry"],
  "sev puri":           ["bhel puri", "salad (mixed veg)"],
  "bread pakora":       ["dhokla", "vegetable poha"],

  // Main Course (unhealthy)
  "paneer butter masala": ["palak paneer", "dal tadka", "grilled paneer"],
  "dal makhani":        ["dal tadka", "rajma curry"],
  "malai kofta":        ["palak paneer", "dal makhani"],
  "mutton curry":       ["chicken curry", "fish curry", "soy chunk curry"],

  // Drinks
  "coke":               ["coconut water", "nimbu pani", "buttermilk"],
  "fruit juice":        ["coconut water", "buttermilk", "nimbu pani"],
  "tea (with sugar)":   ["black tea", "black coffee", "buttermilk"],
  "lassi":              ["plain curd", "buttermilk"],

  // Sweets
  "gulab jamun":        ["plain curd", "rasgulla"],
  "jalebi":             ["plain curd", "fruit"],
  "kheer":              ["plain curd", "oats with milk"],
  "ladoo":              ["plain curd", "handful of nuts"],
  "gajar ka halwa":     ["boiled carrot salad", "oats"],
  "shrikhand":          ["plain curd", "buttermilk"],

  // Staples
  "butter naan":        ["roti", "plain paratha"],
  "white rice":         ["brown rice", "jeera rice with less oil"],
};

/**
 * Returns smart alternatives for a given food item.
 */
function getAlternatives(foodName) {
  const normalized = foodName.toLowerCase().trim();
  return alternativesMap[normalized] || [];
}

module.exports = { getAlternatives };
