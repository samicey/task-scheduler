import { SQS } from '@aws-sdk/client-sqs';

export const getSQSManager = (): SQS => {
  const awsRegion = process.env.AWS_REGION;
  const sqsManager = new SQS({
    region: awsRegion,
  });

  return sqsManager;
};

export const getScheduleQueueUrl = async (): Promise<string | undefined> => {
  const sqsManager = getSQSManager();
  const queueName = process.env.SCHEDULE_QUEUE_NAME;
  const queueUrlResponse = await sqsManager.getQueueUrl({ QueueName: queueName });

    if (!queueUrlResponse.QueueUrl) {
      throw new Error(`${queueName} url is not found in AWS`);
    }

    return queueUrlResponse.QueueUrl;
};
