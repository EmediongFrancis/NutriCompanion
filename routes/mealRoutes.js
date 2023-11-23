const { Router } = require('express');
const mealController = require('../controllers/mealController');

const router = Router();

// Routes.
router.get('/addMeal', mealController.addMeal_get);
router.post('/addMeal', mealController.addMeal_post);

module.exports = router;