const Session = require('./functions/session');
const jwt_decode = require('jwt-decode');
const parser = require('lambda-multipart-parser');

exports.handler = async function (event, context, callback) {
  console.log("Event: ", event);
  var session = new Session();
  var authorizationDecoded = jwt_decode(event.headers.Authorization);
  switch (event.httpMethod) {
    case 'GET':
      if (event.resource == '/photoEvent-sessions') {
        this.response = await session.getSessions(authorizationDecoded.email, event.queryStringParameters.event);
      } else {
        this.response = await session.getSessionsPhotos(authorizationDecoded.email);
      }
      break;
    case 'PUT':
        const form = await parser.parse(event);
        console.log("Form: ",form)
        this.response = await session.putPhoto(form.files[0].filename,form.files[0].contentType,Buffer.from(form.files[0].content),authorizationDecoded.email);
      break;
    case 'POST':
      console.log("### POST ####")
      this.response = await session.setSession(event.body, authorizationDecoded.email);
      break;
    default:
    // code
  }
  console.log("Response: ", this.response);
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