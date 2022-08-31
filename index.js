const Session = require('./session');
const jwt_decode = require('jwt-decode');

exports.handler = async function (event, context, callback) {
  console.log("Event: ", event);
  var session=new Session();
  var authorizationDecoded = jwt_decode(event.headers.Authorization);
  switch (event.httpMethod) {
    case 'GET':
      if (event.resource == '/photoEvent-sessions') {
        this.response = this.session.getSessions(authorizationDecoded.email);
      } else {
        this.response = this.session.getSessionsPhotos(authorizationDecoded.email);
      }
      break;
    case 'PUT':
      this.response = this.session.putPhoto(authorizationDecoded.email, event.body, event.queryStringParameters.fileName);
      break;
    case 'POST':
      console.log("### POST ####")
      this.response = this.session.setSessions(event.body, authorizationDecoded.email);
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