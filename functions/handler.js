const parser = require('lambda-multipart-parser');
var AWS = require('aws-sdk');
AWS.config.update({region: 'us-east-1'});
var s3 = new AWS.S3();

module.exports.uploadSessionImage = async (event) => {
    const result = await parser.parse(event);
    console.log(result.files);

    try {
        var filePath = "poc/" + result.files[0].filename
        var params = {
            "Body": new Buffer(result.files[0].content),
            "Bucket": "sebas-poc-images-fuck-bitch",
            "Key": filePath,
            "ContentType ": 'image/jpeg'
        };

        await s3.upload(params).promise();
    } catch (e) {
        console.log(e)
        return {
            error: e
        }
    }


    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: result.files,
                input: event,
            },
            null,
            2
        ),
    };
};
