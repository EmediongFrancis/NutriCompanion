const express = require('express');
const mongoose = require('mongoose');
const { MongoClient } = require('mongodb');
const authRoutes = require('./routes/authRoutes');
const mealRoutes = require('./routes/mealRoutes');
const app = express();
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const LoggedMeal = require('./models/LoggedMeals');
const { requireAuth, checkUser } = require('./middleware/authMiddleware');

const uri = 'mongodb://localhost:27017';
const dbName = 'nutricompanion';
const collName = 'foodItems';
const port = 6969;

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
app.get('/generateReport', requireAuth, async (req, res) => {
    try {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        console.log('Connected to MongoDB...');

        const db = client.db(dbName);
        const collection = db.collection(collName);

        const foodItems = await collection.find({}).toArray();

        if (foodItems.length === 0) {
            console.log('No data found in the foodItems collection.');
        } else {
            console.log('Found data in the foodItems collection! Yaay!');
        }

        const userData = req.cookies.jwt;
        const userID = jwt.decode(userData);
        const userId = userID.id;
        const loggedMeals = await LoggedMeal.find({ userIDT: userId });
        console.log(loggedMeals);

        const detailedMeals = [];

        for (const loggedMeal of loggedMeals) {
            const mealName = loggedMeal.mealName;

            // Fetch data from the 'foodItems' collection for each mealName
            // Attempt to fetch data from the 'foodItems' collection using EnglishName
            let fetchedFoodItem = await collection.findOne({ EnglishName: mealName });

            // If EnglishName doesn't yield results, try using LocalName
            if (!fetchedFoodItem) {
                fetchedFoodItem = await collection.findOne({ LocalName: mealName });
            }

            console.log('Original fetched fI' + fetchedFoodItem);

            if (fetchedFoodItem) {
                detailedMeals.push({ mealName, foodItemDetails: fetchedFoodItem });
            } else {
                detailedMeals.push({ mealName, foodItemDetails: 'Not found' });
            }
        }

        console.log(detailedMeals);


        // res.render('generateReport', { foodItems });
        res.render('generateReport', { detailedMeals });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).send('Error generating report.');
    }
});

app.use(authRoutes);
app.use(mealRoutes);
