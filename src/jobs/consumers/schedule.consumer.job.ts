// eslint-disable-next-line import/no-extraneous-dependencies
import { SQSEvent, SQSHandler } from 'aws-lambda';
import { uploadFileToRepository } from '../../tools/aws-bucket.tool';


export const processScheduleS3Upload: SQSHandler = async (event: SQSEvent) => {
  const { Records } = event;

  if (Records) {
    await Promise.all(
      Records.map(async (record) => {
        console.log(`schedule event ${JSON.stringify(record)}`);
        const { key, scheduleBody } = JSON.parse(record.body);

        try {
          await uploadFileToRepository(scheduleBody, key);
        } catch (error: unknown) {
          throw new Error(
            `${error}: occurred while uploading to S3`
          );
        }
      })
    );
  }
};
