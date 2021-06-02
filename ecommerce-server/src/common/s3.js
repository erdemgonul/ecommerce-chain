const AWS = require('aws-sdk');

const awsS3 = new AWS.S3({apiVersion: 'latest'})

async function uploadInvoicePDF(pdfData, pdfFileName) {
  return await uploadFile('ecomminvoices', pdfData, pdfFileName);
}

async function uploadFile(bucketName, fileContent, fileNameToSave)  {
  const params = {
    Bucket: bucketName,
    Key: fileNameToSave,
    Body: fileContent
  };

  try {
    const data = await awsS3.upload(params).promise()
    console.log(`File uploaded successfully. ${data.Location}`);
  } catch (err) {
    throw err;
  }
}

module.exports = { uploadFile, uploadInvoicePDF };
