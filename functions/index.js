console.log('Loading DynamoDB Lambda function');
const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();
exports.handler = async function(event, context, callback) {
    console.log("Event ",event);
    var data;
    switch (event.httpMethod) {
        case 'GET':
                this.data = await getSessionsPhotos();
                console.log("data:",this.data);
            break;
        case 'PUT':
            // code
            break;
        default:
            // code
    }
  
  return {
    statusCode: 200,
    headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
            "Content-Type": 'application/json'
        },
    body: JSON.stringify(this.data)
  };
};

async function getSessionsPhotos(){
  var params = {
    TableName:"photoEvent-Dynamo-session"
  }
  var result = await dynamo.scan(params).promise();
  var data = result.Items;
  return data;
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