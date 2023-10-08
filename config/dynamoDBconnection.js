const AWS = require('aws-sdk');

// Set the AWS region
AWS.config.update({ region: 'eu-north-1' });

// Create an instance of the DynamoDB Document Client
const dynamodb = new AWS.DynamoDB.DocumentClient();


const params = {
    TableName: 'NutriCompanion',
    KeyConditionExpression: 'email_address = :email',
    ExpressionAttributeValues: {
        ':email': 'user@example.com',
    },
};

dynamodb.query(params, (err, data) => {
    if (err) {
        console.error('Error querying DynamoDB:', err);
    } else {
        console.log('Query result:', data.Items);
    }
});
