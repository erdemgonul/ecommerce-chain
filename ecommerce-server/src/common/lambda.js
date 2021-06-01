const AWS = require('aws-sdk');

const stepFunctions = new AWS.StepFunctions();

const mailSchedulerARN = 'arn:aws:states:eu-west-1:955320737148:stateMachine:EmailSchedulingStateMachine';

async function invokeMailScheduler(email, deliveryDate) {
  return await stepFunctions.startExecution({
    stateMachineArn: mailSchedulerARN,
    input: JSON.stringify({
      dueDate: deliveryDate,
      email
    }),
  }).promise();
}

async function cancelScheduledMail(executionArn) {
  return await stepFunctions.stopExecution({
    executionArn: executionArn
  }).promise()
}

module.exports = { invokeMailScheduler, cancelScheduledMail };
