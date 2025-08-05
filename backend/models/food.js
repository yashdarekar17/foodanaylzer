const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    calories: {
        type: Number,
        required: true
    },
    protein: {
        type: Number,
        required: true
    },
    carbohydrates: {
        type: Number,
        required: true,
        default: 0
    },
    fat: {
        type: Number,
        required: true
    },
    fiber: {
        type: Number,
        default: 0
    },
    sugar: {
        type: Number,
        default: 0
    },
    saturatedFat: {
        type: Number,
        default: 0
    },
    unsaturatedFat: {
        type: Number,
        default: 0
    },
    vitamins: {
        type: Map,
        of: String,
        default: {}
    },
    minerals: {
        type: Map,
        of: String,
        default: {}
    },
    imageUrl: {
        type: String,
        default: ''
    },
    category: {
        type: String,
        enum: ['fruits', 'vegetables', 'grains', 'proteins', 'dairy', 'other'],
        default: 'other'
    },
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

});

const Food = mongoose.model('Food', foodSchema);

module.exports = Food;