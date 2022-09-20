const index = require('../index');
const jwt_decode = require('jwt-decode');
const Session = require('./session');
//const event = require('./requesExample');
//const event = require('./requestExampleGetPhotos');
//const event = require('./requestExamplePOST');

const event= {
    "resource": "/photoEvent-sessions",
  "path": "/photoEvent-sessions",
  "httpMethod": "GET",
  "headers": {
      "Authorization": "eyJraWQiOiJNa3hlNU4yYTEwMmowSVJTdndaMkNDSmxXV0RmWHF5eU5GdjhXVTFRdjBvPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmNjRjOTMzYy05MTZmLTRiZTgtOThjMy1mNWMwZGI3MDcxYWMiLCJjb2duaXRvOmdyb3VwcyI6WyJwaG90b2dyYXBoZXIiXSwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy13ZXN0LTIuYW1hem9uYXdzLmNvbVwvdXMtd2VzdC0yX1ZDZDRNWjlYOCIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImNvZ25pdG86dXNlcm5hbWUiOiJzZWJhc2NhcmRvbmFjMTEiLCJnaXZlbl9uYW1lIjoiU2ViYXN0aWFuIiwib3JpZ2luX2p0aSI6ImFjOTc0NTAyLWI2OGItNDgzMS05MjFiLTE1YzVlMTM5ZjE0ZCIsImNvZ25pdG86cm9sZXMiOlsiYXJuOmF3czppYW06OjU0Nzc0OTQ2MjgwMjpyb2xlXC9Db2duaXRvX3Bob3RvRXZlbnRBdXRoX1JvbGUiXSwiYXVkIjoidm0xc3AydTZnYzFndXY5aDJrNDN2ZDM0IiwiZXZlbnRfaWQiOiI0N2NkZWE1OS03OGI0LTQ0YzUtOTUxNi1lMGJhOGVhZmUwOTgiLCJ0b2tlbl91c2UiOiJpZCIsImF1dGhfdGltZSI6MTY2MzY4ODY3MCwibmlja25hbWUiOiJzZWJhc2NhcmRvbmFjMTEiLCJwaG9uZV9udW1iZXIiOiIrNTczMTQ3MTM4NzY4IiwiZXhwIjoxNjYzNzA5MjQwLCJpYXQiOjE2NjM3MDU2NDAsImp0aSI6ImVmN2UxZTQ2LTg5YjUtNGNjYi1hYjM1LTJlOGYyZjVhMjhkMiIsImVtYWlsIjoic2ViYXNjYXJkb25hYzExQGdtYWlsLmNvbSJ9.qIz9xlFhCTNqMgO540kAL35G_3k8Eg4kbaxFXkpVxMNDUrm9AuKo5JWv4BiB506mTsDW-ZSfYitsmMIdb1JzxqPDxrXIm9sRJNtHum9IYk8F9b6URdS-V8-Ucg73yrokC7IRlg1kekNcjA-I2QffpD-PChMky1z1eppkecza56UqLVry-vWCeu7ntzFSZoor4PUOjpPmuG-llmCjl-jvOFPN9F5MR4xSatEZvmaVFJ5eR1y40vXrSD8n-CvPtX53qG1i9hAJkSxYdRYF88PLbVkWisIBlpdgtIY43_jL__-3g1nVPCOgrAvocDORhCUYJpoiDuco2cWHQ01_x-BvXQ"
  },
  "queryStringParameters": { "event": "EVENT#12bf90bf-95a6-4692-bc04-4b19a5b0aa65"}
}
index.handler(event,{},{});