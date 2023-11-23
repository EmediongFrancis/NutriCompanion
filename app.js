const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const LoggedMeal = require('./models/LoggedMeals');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

// Middlewares.
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View Engine.
app.set('view engine', 'ejs');

// Database connection.
const dbURI = 'mongodb://localhost:27017/nutricompanion';
mongoose.connect(dbURI, {})
    .then((result) => app.listen(6969))
    .catch((err) => console.log(err));

// Routes.
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));

app.get('/logMeal', requireAuth, async (req, res) => {
    try {
        // Fetch data from the 'loggedmeals' collection using your Mongoose model
        const userData = req.cookies.jwt;
        const userID = jwt.decode(userData);
        const userId = userID.id;
        const loggedMeals = await LoggedMeal.find({ userIDT: userId });


        // Render the 'logMeals' EJS template and pass the retrieved data
        res.render('logMeals', { loggedMeals }); // 'loggedMeals' is passed as a variable to the EJS template
    } catch (error) {
        // Handle errors appropriately
        console.error('Error fetching logged meals:', error);
        res.status(500).send('Error fetching logged meals');
    }
});

app.get('/addMeal', requireAuth, (req, res) => res.render('addMeal'));
app.use(authRoutes);
app.use(mealRoutes);
