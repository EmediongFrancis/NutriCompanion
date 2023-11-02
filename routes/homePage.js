const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Define a route for the homepage
router.get('/', (req, res) => {
    // Read the content of homePage.html
    const homePagePath = path.join(__dirname, '../public/homePage.html');

    fs.readFile(homePagePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            // Send the HTML content as the response
            res.send(data);
        }
    });
});

module.exports = router;
