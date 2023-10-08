const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 6969;

// Middleware.
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


// Define routes.
const fetchMealsRouter = require('./routes/mealsRoutes'); // Route to log meals
//const usersRouter = require('./routes/usersRoutes'); // Route users are taken to upon login
const homePageRouter = require('./routes/homePage'); // Route to the main homepage
//const reportsRouter = require('./routes/generateReport'); // Route to generate reports

// Use routes
app.use('/', homePageRouter);
//app.use('/api/report', reportsRouter);
app.use('/api/meals', fetchMealsRouter);
//app.use('/api/users', usersRouter);

// Error handling middleware.
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}! 🚀`);
});
