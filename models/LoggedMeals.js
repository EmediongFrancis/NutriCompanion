const mongoose = require('mongoose');

const mealSchema = new mongoose.Schema({

    userIDT: {
        type: String,
        required: [true, 'User ID is not attached.']
    },

    date: {
        type: Date,
        default: Date.now

    },

    mealName: {
        type: String,
        required: [true, 'Please select a meal.'],
    },

    mealType: {
        type: String,
        required: [true, 'Please select a meal type.'],
    },

    portionConsumed: {
        type: String,
        required: [true, 'Please select a portion size.'],
    }
});

mealSchema.post('save', function (doc, next) {
    console.log('New meal was created and saved.', doc);
    next();
});

const LoggedMeals = mongoose.model('LoggedMeals', mealSchema);

module.exports = LoggedMeals;
