const AWS = require('aws-sdk');
// AWS.config.update({ region: 'us-east-2' });
const parser = require('lambda-multipart-parser');
const s3Client = new AWS.S3();
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = class Session {
    constructor() {
    }
    async getSessionsPhotos(email) {
        var params = {
            Bucket: "photoevent",
            Prefix: "photoClient",
            MaxKeys: 5
        };
        //const objects = await s3Client.listObjectsV2(params).promise();
        //console.log('objects ', objects)
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
    async putPhoto(event) {
        const result = await parser.parse(event);
        console.log(result.files);
        try {
            var filePath = "photoClient/" + result.files[0].filename
            var params = {
                "Bucket": "photoevent",
                "Body": result.files[0].content,
                "Key": filePath,
                "ContentType": result.files[0].contentType
            };
    
            await s3Client.upload(params).promise();
        } catch (e) {
            console.log(e)
            return {
                error: e
            }
        }
        return {
            statusCode: 200,
            body: JSON.stringify(
                {
                    message: result.files,
                    input: event,
                },
                null,
                2
            ),
        };
    }
}
