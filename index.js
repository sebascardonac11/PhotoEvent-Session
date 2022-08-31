const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3Client = new AWS.S3();

const jwt_decode = require('jwt-decode');

exports.handler = async function (event, context, callback) {
  console.log("Event: ", event);
  var authorizationDecoded = jwt_decode(event.headers.Authorization);
  switch (event.httpMethod) {
    case 'GET':
      if (event.resource == '/photoEvent-sessions') {
        this.response = await getSessions(authorizationDecoded.email);
      } else {
        this.response = await getSessionsPhotos(authorizationDecoded.email);
      }
      break;
    case 'PUT':
      this.response = await putPhoto(authorizationDecoded.email, event.body, event.queryStringParameters.fileName);
      break;
    case 'POST':
      console.log("### POST ####")
      this.response = await setSessions(event.body, authorizationDecoded.email);
      break;
    default:
    // code
  }
  return {
    statusCode: this.response.statusCode,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      "Content-Type": 'application/json'
    },
    body: JSON.stringify(this.response.data)
  };
};

async function getSessionsPhotos(email) {
  var params = {
    Bucket: "photoevent/photoClient",
    MaxKeys: 5
  };
  const objects = await s3Client.listObjectsV2(params).promise();
  console.log('objects ', objects)
  return {
    statusCode: 200,
    data: [{ 'photo': 'Aqui van las fotos' }]
  }
}
async function setSessions(body, photographer) {
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
async function getSessions(email) {
  try {
    var params = {
      TableName: "photoEvent-Dynamo-session",
      FilterExpression: "contains(photographer, :photographer)",
      ExpressionAttributeValues: { ":photographer": email }
    }
    var result = await dynamo.scan(params).promise();
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
async function putPhoto(email, data, fileName) {
  try {
    const params = {
      Bucket: 'photoevent/photoClient',
      Body: JSON.stringify(data),
      Key: fileName,
      ContentType: 'image/jpeg',
      Metadata: {
        "Photographer": email
      }
    };
    const newData = await s3Client.putObject(params).promise();
    return {
      statusCode: 201,
      data: data
    }
  } catch (error) {
    console.log("Something wrong in putPhoto: ", error)
    return {
      statusCode: 404,
      data: data
    }
  }
}