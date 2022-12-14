const Session = require('./functions/session');
const jwt_decode = require('jwt-decode');
const parser = require('lambda-multipart-parser');

exports.handler = async function (event, context, callback) {
  try {
    //console.log("Event: ", event);
    var session = new Session(process.env.BUCKET, process.env.DYNAMODB);
    //var session = new Session('photoeventdev', 'photoEvent');
    var response = { statusCode: 401, data: "Whitout Information" };
    var authorizationDecoded = jwt_decode(event.headers.Authorization);
    switch (event.httpMethod) {
      case 'GET':
        if (event.resource == '/photoEvent-sessions/session/person') {
          response = await session.getPersons(event.queryStringParameters.session)
        }
        if (event.resource == '/photoEvent-sessions') {
          response = await session.getSessions(authorizationDecoded.email, event.queryStringParameters.event);
        }
        break;
      case 'PUT':
        //console.log("### PUT ####");
        const form = await parser.parse(event);
          var key = form.event + '/' + form.session + '/' + form.files[0].filename;
          var contenType = form.files[0].contentType;
          var body = Buffer.from(form.files[0].content);
          response = await session.putPhoto(key, contenType, body, authorizationDecoded.email);
        break;
      case 'POST':
        //console.log("### POST ####")
        response = await session.setSession(event.body, authorizationDecoded.email);
        break;
      default:
      // code
    }
    //console.log("Response: ", response);
    return {
      statusCode: response.statusCode,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
        "Content-Type": 'application/json'
      },
      body: JSON.stringify(response.data)
    };
  } catch (error) {
    console.log("!!!!!!!!Something wrong:",error);
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT",
        "Content-Type": 'application/json'
      },
      body: "We have a error in the back."
    };
  }
};