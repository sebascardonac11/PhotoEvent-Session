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
      console.log("### PUT ####");
      const form = await parser.parse(event);
      this.response={statusCode: 200,data:[]}
      form.files.forEach(async file => {
        var key = form.event + '/' + form.session + '/' + file.filename;
        var contenType = file.contentType;
        var body = Buffer.from(file.content);
         this.response.data.push( await session.putPhoto(key, contenType, body, authorizationDecoded.email));
      });
      break;
    case 'POST':
      console.log("### POST ####")
      this.response = await session.setSession(event.body, authorizationDecoded.email);
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