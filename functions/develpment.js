const jwt_decode = require('jwt-decode');
const Session = require('./session');
//const event = require('./requesExample');
const event = require('./requestExampleGetPhotos');
//const event = require('./requestExamplePOST');

handler(event);

async function handler(event) {
    var data;
    var authorizationDecoded = jwt_decode(event.headers.Authorization);
    var session=new Session();
    //console.log("JWT: ", authorizationDecoded.username);
    switch (event.httpMethod) {
        case 'GET':
            if (event.resource == '/photoEvent-sessions') {
                //this.data = await getSessions(authorizationDecoded.email);
                this.data=session.getSessionsPhotos(authorizationDecoded.email);
            } else {
                this.data=session.getSessionsPhotos(authorizationDecoded.email);
            }
            break;
        case 'PUT':
            this.data=session.putPhoto(authorizationDecoded.email, event.body);
            //console.log("Event contenttype",event.`content-type`)
            break;
        case 'POST':
            console.log("### POST ####")
            this.data=session.setSessions(event.body,authorizationDecoded.email);
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