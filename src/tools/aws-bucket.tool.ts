import { PutObjectCommand, PutObjectCommandOutput, S3 } from '@aws-sdk/client-s3';
const getBucketManager = (): S3 => {
    const awsRegion = process.env.SERVERLESS_PROVIDER_REGION;
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID;
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  
    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey) {
      throw new Error('aws credentials missing');
    }
  
    const bucketManager = new S3({
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
      region: awsRegion,
    });
  
    return bucketManager;
  };
  
export const uploadFileToRepository = async (
    documentBody: string,
    key: string,
  ): Promise<void> => {
    try {
        const bucketManager = getBucketManager();
        const bucketName = process.env.AWS_BUCKET_NAME;
      
        console.log(`uploadFileToRepository: uploading file with key ${key}`);
      
        if (bucketName && documentBody) {
          const parameters = new PutObjectCommand({
            Body: documentBody,
            Bucket: bucketName,
            Key: key,
          });
      
         await bucketManager.send(parameters);
        }
    } catch (error: any) {
        throw new Error(`error: ${error.message} while trying upload to s3`);
    }
  };