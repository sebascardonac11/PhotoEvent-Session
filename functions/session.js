const AWS = require('aws-sdk');
// AWS.config.update({ region: 'us-east-2' });
const s3Client = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = class Session {
    constructor() {
    }
    async getSessionsPhotos(key) {
        var params = {
            Bucket: "photoevent",
            Prefix: key,
            MaxKeys: 5
        };
        const objects = await s3Client.listObjectsV2(params).promise();
        console.log('objects ', objects)
        return {
            statusCode: 200,
            data: [{ 'photo': 'Aqui van las fotos' }]
        }
    }
    async getSessions(email, event) {
        try {
            var params = {
                TableName: 'photoEvent-Dynamo-session',
                KeyConditionExpression: 'photographer =:s',
                FilterExpression: 'event = :e',
                ExpressionAttributeValues: {
                    ':s': email,
                    ':e': event
                }
            };
            var result = await dynamo.query(params).promise();
            var data = result.Items;
            return {
                statusCode: 200,
                data: data
            }
        } catch (error) {
            return {
                statusCode: 404,
                data: error
            }
        }
    }
    async setSession(body, photographer) {
        try {
            var Item = JSON.parse(body);
            Item.photographer = photographer
            var params = {
                TableName: "photoEvent-Dynamo-session",
                Item: Item
            }
            console.log("param: ", params)
            var result = await dynamo.put(params).promise();

            return {
                statusCode: 201,
                data: result
            }
        } catch (error) {
            console.log("Someting Wrong creating sessions", error)
            return {
                statusCode: 409,
                data: result
            };
        }
    }
    async putPhoto(fileName,contentType,body,email) {
        try {
            var filePath = "photoClient/" + fileName
            var params = {
                Bucket: "photoevent",
                Body: body,
                Key: filePath,
                ContentType: contentType,
                Metadata: {
                    "Photographer": email
                }
            };
            var photo = await s3Client.upload(params).promise();
            return {
                statusCode: 200,
                data: photo
            }
        } catch (error) {
            console.log("Something wrong in session.putPhoto: ", error)
            return {
                statusCode: 404,
                data: error
            }
        }
    }
}
