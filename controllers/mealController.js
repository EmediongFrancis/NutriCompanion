const Meal = require('../models/LoggedMeals');
const User = require('../models/User')
const jwt = require('jsonwebtoken')


module.exports.addMeal_get = (req, res) => {
    res.render('addMeal');
}

module.exports.addMeal_post = async (req, res) => {
    const { mealName, mealType, portionConsumed } = req.body;
    const userData = req.cookies.jwt;
    const userID = jwt.decode(userData);
    const userIDT = userID.id;
    console.log(userIDT);
    try {
        const meal = await Meal.create({ userIDT, mealName, mealType, portionConsumed });
        res.status(201).json({ meal: meal._id });
    } catch (err) {
        console.log(err);
    }
}

module.exports.logMeals_post = async (req, res) => {

}