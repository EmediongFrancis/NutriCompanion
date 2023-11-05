const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const app = express();
const cookieParser = require('cookie-parser');
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
app.get('/logMeal', requireAuth, (req, res) => res.render('mealconsole'));
app.use(authRoutes);
