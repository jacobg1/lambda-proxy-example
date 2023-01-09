import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { handleUpload } from "./handlers/handleUpload";
import { handleGetObjectUrl } from "./handlers/handleGetObjectUrl";
import { HttpRoutes } from "./interface/httpRoutes";
import { extractReqData, handleError, handleResponse } from "./utils/format";

const routeConfig = {
  [HttpRoutes.GET_DOC_BY_NAME]: handleGetObjectUrl,
  [HttpRoutes.UPLOAD_DOC]: handleUpload,
};

const handleEvent = async (event: APIGatewayProxyEventV2) => {
  const { method, path } = event?.requestContext?.http;

  if (!method || !path) {
    throw new Error("Missing http requestContext");
  }

  const handler = routeConfig[`${method} ${path}` as HttpRoutes];

  if (!handler) {
    throw new Error("Missing handler");
  }

  return handler(extractReqData(event));
};

export const handle: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    const response = await handleEvent(event);
    return handleResponse(response);
  } catch (e) {
    return handleError(e);
  }
};
