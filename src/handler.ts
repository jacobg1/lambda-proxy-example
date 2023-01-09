import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { handleUpload } from "./handlers/handleUpload";
import { handleGetObjectUrl } from "./handlers/handleGetObjectUrl";
import { HttpRoutes, RequestData } from "./interface/httpRoutes";

// TODO: schema or DTO validation
const parseReqBody = (body: string): unknown => {
  try {
    return JSON.parse(body);
  } catch (e) {
    throw new Error(e);
  }
};

const extractReqData = (event: APIGatewayProxyEventV2): RequestData | {} => {
  const { body, queryStringParameters, pathParameters } = event;

  return {
    ...(body && { body: parseReqBody(body) }),
    ...(queryStringParameters && { queryStringParameters }),
    ...(pathParameters && { pathParameters }),
  };
};

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
    return {
      statusCode: 200,
      isBase64Encoded: false,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (e) {
    return {
      statusCode: 500,
      isBase64Encoded: false,
      headers: {
        "Content-Type": "text/plain",
        "x-amzn-ErrorType": e.name || "Error",
      },
      body: e.message || "Internal Server Error",
    };
  }
};
