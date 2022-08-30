const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3Client = new AWS.S3();

const jwt_decode = require('jwt-decode');
const event = require('./requesExample');


handler(event);

async function handler(event) {
    var data;
    var authorizationDecoded = jwt_decode(event.headers.Authorization);
    //console.log("JWT: ", authorizationDecoded.username);
    switch (event.httpMethod) {
        case 'GET':
            if (event.resource == '/photoEvent-sessions') {
                this.data = await getSessions(authorizationDecoded.email);
            } else {
                this.data = await getSessionsPhotos(authorizationDecoded.email);
            }
            break;
        case 'PUT':
            this.data = await putPhoto(authorizationDecoded.email, event.body);
            break;
        default:
        // code
    }
    //console.log("data: ", this.data)
    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(this.data)
    };
};

async function getSessionsPhotos(email) {
    var params = {
        TableName: "photoEvent-Dynamo-session"
    }
    var result = await dynamo.scan(params).promise();
    var data = result.Items;
    return data;
}
async function getSessions(email) {
    var params = {
        TableName: "photoEvent-Dynamo-session"
    }
    var result = await dynamo.scan(params).promise();
    var data = result.Items;
    return data;
}
async function putPhoto(email, data) {
    try {


        const params = {
            Bucket: 'photoevent4/photoClient',
            Body: JSON.stringify(data),
            Key: 'test.jpg',
            ContentType: 'image/jpeg',
            Metadata: {
                "Photographer": email
            }
        };

        const newData = await s3Client.putObject(params).promise();

        if (!newData) {
            throw Error('there was an error writing the file');
        }
        console.log("newData: ", newData);
        return newData;
    } catch (error) {
        console.log("Error: ");
        return error;
    }
}