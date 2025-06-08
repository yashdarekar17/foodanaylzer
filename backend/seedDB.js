const mongoose = require('mongoose');
const Food = require('./models/food');



mongoose.connect(process.env.MONGO_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true
    
});

const seedData = [
    
    {
        name: 'Banana',
        calories: 105,
        protein: 1.3,
        carbohydrates: 27,
        fat: 0.4,
        fiber: 3.1,
        sugar: 14,
        saturatedFat: 0.1,
        unsaturatedFat: 0.3,
        vitamins: {
            'Vitamin C': '17% DV',
            'Vitamin B6': '22% DV',
            'Folate': '6% DV'
        },
        minerals: {
            'Potassium': '12% DV',
            'Magnesium': '8% DV',
            'Manganese': '15% DV'
        },
        imageUrl: 'https://example.com/banana.jpg',
        category: 'fruits'
    },
    {
        name: 'Broccoli',
        calories: 55,
        protein: 3.7,
        carbohydrates: 11.2,
        fat: 0.6,
        fiber: 5.1,
        sugar: 2.6,
        saturatedFat: 0.1,
        unsaturatedFat: 0.5,
        vitamins: {
            'Vitamin C': '135% DV',
            'Vitamin K': '116% DV',
            'Folate': '14% DV',
            'Vitamin A': '11% DV'
        },
        minerals: {
            'Potassium': '8% DV',
            'Manganese': '10% DV',
            'Phosphorus': '6% DV'
        },
        imageUrl: "/uploads/1749331127714.jpg",
        category: 'vegetables'
    },
    {
        name: 'Chicken Breast',
        calories: 165,
        protein: 31,
        carbohydrates: 0,
        fat: 3.6,
        fiber: 0,
        sugar: 0,
        saturatedFat: 1.1,
        unsaturatedFat: 2.5,
        vitamins: {
            'Vitamin B6': '25% DV',
            'Niacin': '70% DV',
            'Vitamin B12': '10% DV'
        },
        minerals: {
            'Phosphorus': '20% DV',
            'Selenium': '36% DV',
            'Zinc': '7% DV'
        },
        imageUrl: "",
        category: 'proteins'
    },
    {
        name: 'Salmon',
        calories: 208,
        protein: 22.1,
        carbohydrates: 0,
        fat: 13.4,
        fiber: 0,
        sugar: 0,
        saturatedFat: 3.1,
        unsaturatedFat: 10.3,
        vitamins: {
            'Vitamin D': '100% DV',
            'Vitamin B12': '106% DV',
            'Niacin': '50% DV',
            'Vitamin B6': '35% DV'
        },
        minerals: {
            'Selenium': '60% DV',
            'Phosphorus': '25% DV',
            'Potassium': '18% DV'
        },
        imageUrl: 'https://example.com/salmon.jpg',
        category: 'proteins'
    }
];

const seedDB = async () => {
    try {
        // Clear existing data
        await Food.deleteMany({});
        
        // Insert new data
        const foods = await Food.insertMany(seedData);
        console.log(`${foods.length} foods added to the database`);
        
        mongoose.connection.close();
    } catch (err) {
        console.error(err);
        mongoose.connection.close();
    }
};

seedDB();
