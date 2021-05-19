const AWS = require('aws-sdk');

const stepfunctions = new AWS.StepFunctions();

module.exports.handle = async (event) => {
    const stateMachineArn = process.env.STATEMACHINE_ARN;
    const stringifiedEvent = JSON.stringify(event);

    console.log(`Event: ${stringifiedEvent}`);

    const result = await stepfunctions.startExecution({
        stateMachineArn,
        input: stringifiedEvent,
    }).promise();

    console.log(`State machine ${stateMachineArn} executed successfully`, result);

    return result;
};
