const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY_AGENT1 
});

/**
 * Parses natural language food input into structured JSON.
 * Example: "2 plates of paneer butter masala with 1 naan"
 * Returns: { food: "paneer butter masala", quantity: 2, extras: ["naan"] }
 */
async function parseFoodInput(text) {
  try {
    const prompt = `
      You are a nutrition assistant. Parse the following food input into structured JSON.
      Input: "${text}"

      Rules:
      1. "food" = the complete dish name INCLUDING cooking method/style (e.g., "chicken fry", "paneer butter masala", "fried rice", NOT just "chicken" or "paneer").
      2. If the user mentions an oil or cooking medium (e.g., "sunflower oil", "ghee"), include it in the "extras" array, NOT stripped from the dish name.
      3. "quantity" = number of servings (default 1 if not mentioned).
      4. "extras" = side items, oils, condiments mentioned separately.
      5. Use lowercase for all names.
      6. Return ONLY the JSON. No extra text.

      Examples:
      - "2 plates chicken fry with sunflower oil" → { "food": "chicken fry", "quantity": 2, "extras": ["sunflower oil"] }
      - "paneer butter masala with naan"          → { "food": "paneer butter masala", "quantity": 1, "extras": ["naan"] }
      - "boiled eggs"                             → { "food": "boiled eggs", "quantity": 1, "extras": [] }

      Format:
      {
        "food": "...",
        "quantity": 1,
        "extras": []
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("AI Parsing Error:", error);
    return { food: text.toLowerCase(), quantity: 1, extras: [] };
  }
}

/**
 * Parses full meals into multiple items.
 */
async function parseMealInput(text) {
  try {
    const prompt = `
      You are a nutrition assistant. Parse the following meal description into an array of structured JSON items.
      Input: "${text}"

      Rules:
      1. Extract every distinct food item mentioned.
      2. "food": name of the dish (e.g., "roti", "paneer butter masala").
      3. "quantity": number of servings or items (default 1 if not specified as a number).
      4. Normalize names to lowercase.
      5. Return ONLY a JSON object with an "items" array. No extra text.

      Example: "I ate 2 samosas and a coffee" 
      Returns: { "items": [{ "food": "samosa", "quantity": 2 }, { "food": "coffee", "quantity": 1 }] }

      Format:
      {
        "items": [
          { "food": "...", "quantity": 1 }
        ]
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("Meal Parsing Error:", error);
    // Simple fallback: treat whole text as one item
    return { items: [{ food: text.toLowerCase(), quantity: 1 }] };
  }
}

/**
 * Estimates nutritional values for a food item when not found in database or API.
 */
async function estimateNutrition(foodName) {
  try {
    const prompt = `
      Estimate the nutritional values for one serving of "${foodName}" (Indian context).
      Important:
      1. If the name is a single pure ingredient (e.g., "sugar", "salt", "oil", "ghee", "butter"), provide accurate data for 1 serving (approx 15-20g or 100g as standard).
      2. If the user input contains a typo (e.g., "suger" for "sugar", "paneer" for "panir"), interpret it as the intended food.
      Return ONLY a JSON object with the following fields:
      - name (the corrected/intended name)
      - calories (number)
      - protein (number, in grams)
      - fat (number, in grams)
      - carbohydrates (number, in grams)
      - fiber (number, in grams)
      - sugar (number, in grams)
      - category (string from: main_course, staple, street_food, fast_food, healthy, drink, sweet, protein)

      Format:
      {
        "name": "${foodName}",
        "calories": 0,
        "protein": 0,
        "fat": 0,
        "carbohydrates": 0,
        "fiber": 0,
        "sugar": 0,
        "category": "..."
      }
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.2,
      response_format: { type: 'json_object' }
    });

    return JSON.parse(chatCompletion.choices[0].message.content);
  } catch (error) {
    console.error("AI Estimation Error:", error);
    return null;
  }
}

/**
 * Generates a human-friendly, personalized explanation of why a food is healthy or risky.
 * When the food is Risky or Moderate, it also suggests better alternatives tailored to the
 * user's combined goal + health conditions.
 *
 * @param {Object} foodData   - Nutritional info + riskScore + status
 * @param {Object} userProfile - { goal: string, conditions: string[] } — optional
 */
async function getFoodExplanation(foodData, userProfile = null) {
  try {
    const { name, calories, protein, fat, carbohydrates, riskScore, status } = foodData;
    const isRisky = status === 'Risky' || status === 'Moderate';

    // ── Build user context string ─────────────────────────────────────────
    let userContext = '';
    if (userProfile) {
      const { goal, conditions } = userProfile;
      const condList = Array.isArray(conditions)
        ? conditions.filter(Boolean).join(', ')
        : (conditions || '');
      if (goal || condList) {
        userContext = `
User Profile:
- Fitness Goal: ${goal || 'not specified'}
- Health Conditions: ${condList || 'none'}
`;
      }
    }

    // ── Build suggestion instruction ──────────────────────────────────────
    let suggestionInstruction = '';
    if (isRisky && userProfile) {
      const { goal, conditions } = userProfile;
      const condList = Array.isArray(conditions)
        ? conditions.filter(Boolean).join(', ')
        : (conditions || '');

      suggestionInstruction = `
Since this food is ${status} for this user, also suggest 3-4 specific alternative foods or meals that are:
- Safe / low-risk for their health condition(s): ${condList || 'none'}
- Also aligned with their goal: ${goal || 'general health'}
- Practical and easy to find in an Indian context

Format the suggestions as a short bullet list starting with " Better alternatives for you:".
`;
    } else if (isRisky) {
      suggestionInstruction = `
Since this food is ${status}, suggest 3-4 healthier alternatives that serve a similar purpose but with lower risk.
Format the suggestions as a short bullet list starting with " Healthier alternatives:".
`;
    }

    const prompt = `
You are NutriScan AI, a friendly nutrition expert. Analyze this food and give a concise, personalized response.

Food: ${name}
Nutritional Data: Calories: ${calories} kcal | Protein: ${protein}g | Fat: ${fat}g | Carbs: ${carbohydrates}g | Sugar: ${foodData.sugar}g | Fiber: ${foodData.fiber}g
Risk Score: ${riskScore}/100 | Status: ${status}
${userContext}

Instructions:
1. MANDATORY: You MUST explicitly mention the user's Health Conditions (if any) and their Fitness Goal in the first sentence. Explain how this food directly impacts those specific health factors.
2. In 2-3 sentences, explain why this food is ${status.toLowerCase()} for this user — be specific about which nutrients (sugar, sodium, saturated fat, fiber) are problematic or beneficial for their specific profile.
3. If the user has a health condition AND a fitness goal that might conflict (e.g. acid reflux + weight gain), acknowledge the challenge and give practical advice on how to balance both.
4. If risk status is Risky or Moderate, prioritize health safety over total calories.
${suggestionInstruction}

Be warm, direct, and practical. Avoid generic statements. No markdown headers.
    `.trim();

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.5
    });

    return chatCompletion.choices[0].message.content.trim();
  } catch (error) {
    console.error("AI Explanation Error:", error);
    // Better fallback for when the AI service is down
    const name = foodData.name || "this food";
    if (status === 'Safe') return `Based on its nutritional profile, ${name} is a healthy choice for you. It is low in limiting nutrients like sugar and sodium.`;
    if (status === 'Moderate') return `This food should be enjoyed in moderation. It contains moderate levels of sugar, fat, or calories that might slow your ${userProfile?.goal || 'progress'}.`;
    return `Caution: This food is high in nutrients that conflict with your current profile. We recommend looking for a healthier alternative.`;
  }
}

module.exports = {
  parseFoodInput,
  parseMealInput,
  estimateNutrition,
  getFoodExplanation
};
