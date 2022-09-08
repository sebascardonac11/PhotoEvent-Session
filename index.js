const Session = require('./functions/session');
const jwt_decode = require('jwt-decode');
const parser = require('lambda-multipart-parser');

exports.handler = async function (event, context, callback) {
  try {
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
        this.response = { statusCode: 200 }
        form.files.forEach(async file => {
          var key = form.event + '/' + form.session + '/' + file.filename;
          var contenType = file.contentType;
          var body = Buffer.from(file.content);
          var upphoto = await session.putPhoto(key, contenType, body, authorizationDecoded.email);
          console.log("UpPhoto: ", upphoto);
          this.response.data.push(upphoto.data);
          if (upphoto.statusCode != 200)
            this.response.statusCode = 201
        });
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