// This file is used to run lambda locally

import { handle } from "../../handler";
import { APIGatewayProxyEventV2, Context } from "aws-lambda";

const mockDocUploadEvent = {
  requestContext: {
    http: {
      method: "PUT",
      path: "/file/put",
    },
  },
  body: JSON.stringify({ fileName: "test-uploading.jpg" }),
} as APIGatewayProxyEventV2;
//
(async () => {
  try {
    const response = await handle(mockDocUploadEvent, {} as Context, () => null);
    console.log(response);
  } catch (e: unknown) {
    console.error(e);
    throw e;
  }
})();
