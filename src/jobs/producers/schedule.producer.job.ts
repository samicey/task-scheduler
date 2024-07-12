import { getSQSManager, getScheduleQueueUrl } from "../../tools/aws-sqs-manager.tool";

export const sendSQSMessage = async (sqsMessage: {key: string, scheduleBody: string}): Promise<void> => {
  const sqsManager = getSQSManager();
  const message = JSON.stringify(sqsMessage);
  const scheduleQueueUrl = await getScheduleQueueUrl();

  console.log(`schedule queue url: ${scheduleQueueUrl}`);

  try {
    await sqsManager.sendMessage({
      MessageBody: message,
      QueueUrl: `${scheduleQueueUrl}`,
    });
  } catch (error: any) {
    throw new Error(`${error}: occurred while sending an queue message to : ${scheduleQueueUrl}`);
  }
};