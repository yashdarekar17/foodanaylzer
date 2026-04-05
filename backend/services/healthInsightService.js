const Groq = require('groq-sdk');
const dotenv = require('dotenv');

dotenv.config();

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY_AGENT2
});

/**
 * Generates a personalized health insight message based on user's daily calorie progress and goal.
 * @param {Object} stats - { dailyGoal, consumed, remaining, goalType }
 * @param {Object} user - { name, condition }
 * @returns {Promise<string>} - AI generated health coach message
 */
exports.getHealthCoachInsight = async (stats, user) => {
    try {
        const { dailyGoal, consumed, remaining, goalType } = stats;
        const status = consumed > dailyGoal ? 'over' : (consumed > dailyGoal * 0.8 ? 'on track' : 'under');

        const prompt = `
            You are a supportive, high-end Health Coach for the application "NutriScan".
            The user, ${user.name || 'User'}, has a fitness goal of ${goalType}.
            Today's Data:
            - Daily Calorie Goal: ${dailyGoal} kcal
            - Consumed so far: ${consumed} kcal
            - Remaining: ${remaining} kcal
            - Status: ${status}

            Provide a concise, motivating 1-2 sentence insight about their progress.
            - If they are under: encourage them to eat nutrient-dense food.
            - If they are over: suggest balancing it out or choosing lighter options for the next meal.
            - Keep it professional, friendly, and brief (max 30 words).
            - Do not use markdown or bold text.
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: "user", content: prompt }],
            model: "llama-3.3-70b-versatile",
            temperature: 0.7,
            max_tokens: 100,
        });

        return chatCompletion.choices[0]?.message?.content?.trim() || "Stay focused on your daily nutritional goals!";
    } catch (error) {
        console.error("Health Coach Insight Error:", error);
        return "Keep up the great work on your health journey!";
    }
};
