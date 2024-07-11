import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventV2,
  APIGatewayProxyResult,
  APIGatewayProxyStructuredResultV2,
  Context,
} from 'aws-lambda';
import serverless from 'serverless-http';

import { initializeDatabaseConnection } from './database.connection.tool';

export const loadServerlessHandler = (app: Express.Application): any => {
  const handler = serverless(app);

  return async (
    event: APIGatewayProxyEvent | APIGatewayProxyEventV2,
    context: Context
  ): Promise<APIGatewayProxyResult | APIGatewayProxyStructuredResultV2> => {
    await initializeDatabaseConnection();

    return await handler(event, context);
  };
};
