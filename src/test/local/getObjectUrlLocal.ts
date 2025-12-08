// This file is used to run lambda locally

import { handle } from "../../handler";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";

const mockGetObjectUrlEvent = {
  requestContext: {
    http: {
      method: "GET",
      path: "/file/get",
    },
  },
  queryStringParameters: { fileName: "test-uploading.jpg" },
} as unknown as APIGatewayProxyEventV2;

(async () => {
  try {
    const response = await handle(mockGetObjectUrlEvent, {} as Context, () => null);
    console.log(response);
  } catch (e: unknown) {
    console.error(e);
    throw e;
  }
})();
