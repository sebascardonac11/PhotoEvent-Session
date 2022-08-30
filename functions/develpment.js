const bucket = 'photoevent' // the bucketname
const photo = 'photoClient/SCC_0055.jpg'
const AWS = require('aws-sdk')
event={
          "resource": "/photoEvent-lambda-event",
          "path": "/photoEvent-lambda-event",
          "httpMethod": "POST",
          "headers": {
              "Accept": "*/*",
              "Accept-Encoding": "gzip, deflate, br",
              "CloudFront-Forwarded-Proto": "https",
              "CloudFront-Is-Desktop-Viewer": "true",
              "CloudFront-Is-Mobile-Viewer": "false",
              "CloudFront-Is-SmartTV-Viewer": "false",
              "CloudFront-Is-Tablet-Viewer": "false",
              "CloudFront-Viewer-ASN": "10620",
              "CloudFront-Viewer-Country": "CO",
              "Content-Type": "multipart/form-data; boundary=--------------------------375646687762230302476550",
              "Host": "8y8z22vhql.execute-api.us-east-2.amazonaws.com",
              "operation": "read",
              "Postman-Token": "cad2dd57-b974-4fbd-9102-0577c230e205",
              "User-Agent": "PostmanRuntime/7.29.0",
              "Via": "1.1 eea31a927983f0bce2a203db674ff998.cloudfront.net (CloudFront)",
              "X-Amz-Cf-Id": "gHi3wmLJq4lVRdOMiScKeV_pmsFUliVTeH-ZoFuwef9qZhTvO3Ku0g==",
              "X-Amzn-Trace-Id": "Root=1-62e14abc-702d48b5553c2d7c2ef80d65",
              "X-Forwarded-For": "181.58.39.2, 64.252.186.140",
              "X-Forwarded-Port": "443",
              "X-Forwarded-Proto": "https"
          },
          "multiValueHeaders": {
              "Accept": [
                  "*/*"
              ],
              "Accept-Encoding": [
                  "gzip, deflate, br"
              ],
              "CloudFront-Forwarded-Proto": [
                  "https"
              ],
              "CloudFront-Is-Desktop-Viewer": [
                  "true"
              ],
              "CloudFront-Is-Mobile-Viewer": [
                  "false"
              ],
              "CloudFront-Is-SmartTV-Viewer": [
                  "false"
              ],
              "CloudFront-Is-Tablet-Viewer": [
                  "false"
              ],
              "CloudFront-Viewer-ASN": [
                  "10620"
              ],
              "CloudFront-Viewer-Country": [
                  "CO"
              ],
              "Content-Type": [
                  "multipart/form-data; boundary=--------------------------375646687762230302476550"
              ],
              "Host": [
                  "8y8z22vhql.execute-api.us-east-2.amazonaws.com"
              ],
              "operation": [
                  "read"
              ],
              "Postman-Token": [
                  "cad2dd57-b974-4fbd-9102-0577c230e205"
              ],
              "User-Agent": [
                  "PostmanRuntime/7.29.0"
              ],
              "Via": [
                  "1.1 eea31a927983f0bce2a203db674ff998.cloudfront.net (CloudFront)"
              ],
              "X-Amz-Cf-Id": [
                  "gHi3wmLJq4lVRdOMiScKeV_pmsFUliVTeH-ZoFuwef9qZhTvO3Ku0g=="
              ],
              "X-Amzn-Trace-Id": [
                  "Root=1-62e14abc-702d48b5553c2d7c2ef80d65"
              ],
              "X-Forwarded-For": [
                  "181.58.39.2, 64.252.186.140"
              ],
              "X-Forwarded-Port": [
                  "443"
              ],
              "X-Forwarded-Proto": [
                  "https"
              ]
          },
          "queryStringParameters": {
              "": ""
          },
          "multiValueQueryStringParameters": {
              "": [
                  ""
              ]
          },
          "pathParameters": null,
          "stageVariables": null,
          "requestContext": {
              "resourceId": "yjl1db",
              "resourcePath": "/photoEvent-lambda-event",
              "httpMethod": "POST",
              "extendedRequestId": "V7idaEmziYcFfMA=",
              "requestTime": "27/Jul/2022:14:25:00 +0000",
              "path": "/Prod/photoEvent-lambda-event",
              "accountId": "547749462802",
              "protocol": "HTTP/1.1",
              "stage": "Prod",
              "domainPrefix": "8y8z22vhql",
              "requestTimeEpoch": 1658931900020,
              "requestId": "e987240d-6f9a-4dfb-9921-898f2ac4f224",
              "identity": {
                  "cognitoIdentityPoolId": null,
                  "accountId": null,
                  "cognitoIdentityId": null,
                  "caller": null,
                  "sourceIp": "181.58.39.2",
                  "principalOrgId": null,
                  "accessKey": null,
                  "cognitoAuthenticationType": null,
                  "cognitoAuthenticationProvider": null,
                  "userArn": null,
                  "userAgent": "PostmanRuntime/7.29.0",
                  "user": null
              },
              "domainName": "8y8z22vhql.execute-api.us-east-2.amazonaws.com",
              "apiId": "8y8z22vhql"
          },
          "body": "----------------------------375646687762230302476550\r\nContent-Disposition: form-data; name=\"operation\"\r\n\r\nread\r\n----------------------------375646687762230302476550--\r\n",
          "isBase64Encoded": false
      }

var dynamo = new AWS.DynamoDB.DocumentClient();


const TABLE_NAME = 'photoEvent-Dynamo-event';
 const params2 = {
      TableName: TABLE_NAME,
    }
        dynamo.scan(params2,function(err, data){
            console.log(data);
        });
const getAllUsers = async () => {
    const params = {
      TableName: TABLE_NAME,
    }
    try {
      const items = await dynamo.scan(params).promise();
      return { success: true, data: Items }
    } catch(error) {
      return { success: false, data: null }
    }
  }
 const data = getAllUsers;
console.log("Event ", data );