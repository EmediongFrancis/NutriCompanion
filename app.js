const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const jwt = require('jsonwebtoken');
const AWS = require('aws-sdk');
const bcrypt = require('bcrypt');
const { Router } = require('express');
//const authenticateUser = require('./middlewares/authController');

// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: 'eu-north-1' // Replace with your desired region
});

// Create an instance of DynamoDB
const dynamodb = new AWS.DynamoDB();

const globalToken = undefined;


// Create an Express app
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Define your authentication middleware
function authenticateUser(req, res, next) {

    // Stringify the token
    const token = req.rawHeaders[7];

    console.log(token)

    if (!token) {
        // No token found, user is not logged in
        return res.redirect('/');

        // TODO:  Trigger a banner message in the frontend

    }

    // Verify the JWT token
    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) {
            console.error('Error verifying token:', err);
            return res.status(401).json({ message: 'Authentication failed' });
        }

        // If the token is valid, set user information in the request object
        req.user = decoded;
        next(); // Proceed to the next middleware or route handler
    });
}



// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON request bodies
app.use(bodyParser.json());

// Secret key for JWT (change this to a secure key)
const secretKey = 'nutricompanion';

// Landing page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));

});

// Registration endpoint
app.post('/api/signup', (req, res) => {
    // Extract user data from the request body
    const { username, email, password } = req.body;

    // Generate a salt to use for hashing
    bcrypt.genSalt(10, (err, salt) => {
        if (err) {
            console.error('Error generating salt:', err);
            res.status(500).json({ message: 'Registration failed, Salt.' });
        } else {
            // Hash the user's password with the generated salt
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    res.status(500).json({ message: 'Registration failed, Hashing.' });
                } else {
                    // Define the DynamoDB item
                    const params = {
                        TableName: 'Users',
                        Item: {
                            email: { S: email },
                            username: { S: username },
                            passwordHash: { S: hash } // Store the hashed password
                        }
                    };

                    // Put the user data into DynamoDB
                    dynamodb.putItem(params, (err, data) => {
                        if (err) {
                            console.error('Error registering user:', err);
                            res.status(500).json({ message: 'Registration failed, DB.' });
                        } else {
                            console.log('User registered successfully:', data);
                            res.status(201).json({ message: 'Registration successful' });
                        }
                    });
                }
            });
        }
    });

});


app.get('/home', authenticateUser, async (req, res) => {
    // Only authenticated users will reach this route
    res.json({ status: true, message: 'Authentication successful' });
});


// // Handle unauthorized access to the /home route
// app.use('/home', (req, res) => {
//     // Redirect to the login page or send an appropriate response
//     res.redirect('/login');
//});
// Authentication endpoint
app.post('/api/signin', (req, res) => {
    // Extract user credentials from request body (email, password)
    const { email, password } = req.body;

    // Retrieve user data from DynamoDB based on the provided email
    const params = {
        TableName: 'Users',
        Key: {
            email: { S: email }
        }
    };

    dynamodb.getItem(params, (err, data) => {
        if (err) {
            console.error('Error retrieving user data:', err);
            res.status(500).json({ message: 'Authentication failed, User Data.' });
        } else if (!data.Item) {
            // User not found
            res.status(401).json({ message: 'Authentication failed, User not found.' });
        } else {
            // User found, compare hashed password
            const storedPasswordHash = data.Item.passwordHash.S;

            bcrypt.compare(password, storedPasswordHash, (err, result) => {
                if (err || !result) {
                    console.error('Password comparison failed:', err);
                    res.status(401).json({ message: 'Authentication failed' });
                } else {
                    // Passwords match, create a JWT token
                    const token = jwt.sign({ email }, secretKey, { expiresIn: '1h' });
                    res.json({ token, message: 'Authentication successful' });
                }
            });
        }
    });
});

// Start the server
const port = process.env.PORT || 6969;
app.listen(port, () => {
    console.log(`Server is running on port ${port}! 🚀`);
});
