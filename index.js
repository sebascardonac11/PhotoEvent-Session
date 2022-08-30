const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
const s3Client = new AWS.S3();

const jwt_decode = require('jwt-decode');

exports.handler = async function (event, context, callback) {
  console.log("Event: ",event);
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
      console.log("putPhoto");
      var put = await putPhoto(authorizationDecoded.email, event.body);
      console.log("regrese putPhoto");
      if (put) this.data = "Objet Upload"
      else this.data = 'Error';
      break;
    default:
    // code
  }
  var response = {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
      "Content-Type": 'application/json'
    },
    body: JSON.stringify(this.data)
  };
  console.log(response);
  return response;
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
      Bucket: 'photoevent/photoClient',
      Body: data,
      Key: 'test.jpg',
      ContentType: 'image/jpeg',
      Metadata: {
        "Photographer": email
      }
    };
    const newData = await s3Client.putObject(params).promise();
      return true;
  } catch (error) {
    console.log("Something wrong in putPhoto: ", error)
    return false;
  }
}

/* Data dummy para dynamo
{
  "id": {
    "S": "1"
  },
  "date": {
    "S": "2022-02-17"
  },
  "description": {
    "S": "Todas las categorias de FP1"
  },
  "event": {
    "S": "1"
  },
  "name": {
    "S": "FP1"
  },
  "photographer": {
    "S": "f64c933c-916f-4be8-98c3-f5c0db7071ac"
  }
}


*/