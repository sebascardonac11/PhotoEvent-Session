const AWS = require('aws-sdk');
//AWS.config.update({ region: 'us-east-2' });
const s3Client = new AWS.S3();
const Str = require('@supercharge/strings')
const dynamo = new AWS.DynamoDB.DocumentClient();

module.exports = class Session {
    bucketName;
    DYNAMODBTABLE;
    constructor(bucket, table) {
        this.bucketName = bucket;
        this.DYNAMODBTABLE = table
    }
    async getSessionsPhotos(key) {
        try {
            var params = {
                Bucket: this.bucketName,
                Prefix: key,
                MaxKeys: 5
            };
            const objects = await s3Client.listObjectsV2(params).promise();
            for (const i in objects.Contents) {
                const presignedURL = s3Client.getSignedUrl('getObject', {
                    Bucket: this.bucketName,
                    Key: objects.Contents[i].Key,
                    Expires: 10
                });
                objects.Contents[i].url = presignedURL;
            }
            console.log('objects ', objects)
            return {
                statusCode: 200,
                data: objects.Contents
            }
        } catch (error) {
            return {
                statusCode: 404,
                data: error
            }
        }
    }
    async getSessions(email, event) {
        try {
            var params = {
                TableName: this.DYNAMODBTABLE,
                KeyConditionExpression: 'mainkey =:e',
            };
            if (event != 'null') {
                params.FilterExpression = 'photographer  = :s and entity=:entity';
                params.ExpressionAttributeValues = {
                    ':s': email,
                    ':e': event,
                    ':entity': 'SESSION'
                }
            } else {
                //  params.ExpressionAttributeValues = {':s': email,}
            }
            //console.log(params)
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
    async getPersons(event) {
        try {
            return {
                statusCode: 200,
                data: "Aqui van las personas"
            }
        } catch (error) {
            console.log("Someting Wrong in Session.getPersons ", error)
            return {
                statusCode: 400,
                data: "Someting Wrong in Session.getPersons "
            };
        }
    }
    async setSession(body, photographer) {
        try {
            const uuid = Str.uuid();
            var Item = JSON.parse(body);
            Item.photographer = photographer
            Item.mainkey = Item.event;
            Item.mainsort = 'SESSION-' + uuid;
            Item.entity = 'SESSION'
            var params = {
                TableName: this.DYNAMODBTABLE,
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
    async putPhoto(fileName, contentType, body, email) {
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
