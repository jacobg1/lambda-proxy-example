import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { handleGetUploadUrl } from "./handlers/handleGetUploadUrl";
import { handleGetObjectUrl } from "./handlers/handleGetObjectUrl";
import { HttpRoutes } from "./interface/httpRoutes";
import { extractReqData, handleError, handleResponse } from "./utils/format";
import { CustomError } from "./utils/customError";

const routeConfig = {
  [HttpRoutes.GET_DOC_BY_NAME]: handleGetObjectUrl,
  [HttpRoutes.UPLOAD_DOC]: handleGetUploadUrl,
};

const handleEvent = (event: APIGatewayProxyEventV2) => {
  const method = event.requestContext?.http?.method;
  const path = event.requestContext?.http?.path;

  if (!method || !path) {
    throw new CustomError({
      name: "BadRequestException",
      message: "Invalid Request",
      statusCode: 400,
    });
  }
  const handler = routeConfig[`${method} ${path}` as HttpRoutes];
  if (!handler) {
    throw new CustomError({
      name: "NotFoundException",
      message: "Not Found",
      statusCode: 404,
    });
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
