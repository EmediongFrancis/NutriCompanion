const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken'); // For JWT decoding

// Set the AWS region
AWS.config.update({ region: 'eu-north-1' });

// Create a DynamoDB Document Client
const dynamodb = new AWS.DynamoDB.DocumentClient();

// Define the route handler
router.get('/api/meals', (req, res) => {
    const accessToken = req.query.access_token; // Assuming the access token is passed as a query parameter named "access_token"

    if (!accessToken) {
        return res.status(401).json({ error: 'Access token not provided.' });
    }

    // Extract the JWT token from the "access_token" parameter
    const jwtToken = accessToken.split(' ')[1];

    jwt.verify(jwtToken, null, (err, decoded) => {
        if (err) {
            console.error('Error decoding JWT:', err);
            return res.status(401).json({ error: 'Invalid access token.' });
        }

        const userEmail = decoded.email; // Extract the email from the decoded token

        // Define the DynamoDB query parameters
        const params = {
            TableName: 'NutriCompanion', // Replace with your DynamoDB table name
            KeyConditionExpression: 'email_address = :email',
            ExpressionAttributeValues: {
                ':email': userEmail,
            },
        };

        // Query the DynamoDB table
        dynamodb.query(params, (err, data) => {
            if (err) {
                console.error('Error querying DynamoDB:', err);
                return res.status(500).json({ error: 'An error occurred while fetching meals.' });
            } else {
                const meals = data.Items;
                return res.json(meals);
            }
        });
    });
});

module.exports = router;
