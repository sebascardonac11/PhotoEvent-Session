const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3Client = new AWS.S3();

const jwt_decode = require('jwt-decode');
//const event = require('./requesExample');
//const event = require('./requestExampleGetPhotos');
const event = require('./requestExamplePOST');

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
            //this.data = await putPhoto(authorizationDecoded.email, event.body);
            //console.log("Event contenttype",event.`content-type`)
            break;
        case 'POST':
            console.log("### POST ####")
            this.data = await setSessions(event.body,authorizationDecoded.email);
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

async function setSessions(body,photographer) {
    try {
      var  Item =JSON.parse(body);
      Item.photographer=photographer
      var params = {
        TableName: "photoEvent-Dynamo-session",
        Item: Item
      }
      console.log("param: ", params)
      var result = await dynamo.put(params).promise();
      
      return result;
    } catch (error) {
      console.log("Someting Wrong creating sessions", error)
      return error;
    }
  }
async function getSessionsPhotos(email) {
    var params = {
        Bucket: "photoevent", 
        MaxKeys: 10,
        Prefix: "photoClient"
       };
       const objects=await s3Client.listObjectsV2(params).promise();
       objects.Contents.forEach(async (element)  =>{
            var object =await s3Client.headObject({Bucket: "photoevent", Key: element.Key}).promise();
        console.log('objects ',object)
       });
       //console.log('objects ',objects)
      return [
        {'photo':'Aqui van las fotos'}
      ];
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
            Bucket: 'photoevent/photoClient',
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