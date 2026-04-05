const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mealName: {
        type: String,
        default: 'AI Quick Meal'
    },
    originalText: {
        type: String,
        required: true
    },
    items: [{
        foodName: String,
        quantity: Number,
        calories: Number,
        protein: Number,
        fat: Number,
        carbohydrates: Number,
        estimated: { type: Boolean, default: false }
    }],
    totalCalories: {
        type: Number,
        required: true
    },
    totalProtein: { type: Number, default: 0 },
    totalFat: { type: Number, default: 0 },
    totalCarbohydrates: { type: Number, default: 0 },
    date: {
        type: Date,
        default: Date.now
    }
});

// Index for performance on date-based queries
mealLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('MealLog', mealLogSchema);
