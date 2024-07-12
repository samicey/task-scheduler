import { Callback, Context, SQSEvent } from 'aws-lambda';
import { processScheduleS3Upload } from './jobs/consumers/schedule.consumer.job';

const scheduleHandler = async (event: SQSEvent, context: Context, callback: Callback) => {
  await processScheduleS3Upload(event, context, callback);
};

module.exports = {
  scheduleHandler,
};
