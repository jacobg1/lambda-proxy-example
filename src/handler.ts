import { APIGatewayProxyEventV2, APIGatewayProxyHandlerV2 } from "aws-lambda";
import { handleUpload } from "./handlers/handleUpload";
import { handleGetObjectUrl } from "./handlers/handleGetObjectUrl";
import { HttpRoutes } from "./interface/httpRoutes";
import { UploadDocRequest } from "./interface/uploadDoc";

// TODO: schema or DTO validation
const parseReqBody = <T>(body?: string): T => {
  if (!body) {
    throw new Error("Failed to parse req body, undefined body");
  }
  try {
    return JSON.parse(body);
  } catch (e) {
    throw new Error(e);
  }
};

const handleResponse = async (
  event: APIGatewayProxyEventV2
): Promise<unknown> => {
  const { method, path } = event?.requestContext?.http;
  if (!method || !path) {
    throw new Error("Missing http requestContext");
  }
  switch (`${method} ${path}`) {
    case HttpRoutes.GET_DOC_BY_NAME:
      const fileName = event.queryStringParameters?.fileName;
      return handleGetObjectUrl(fileName);
    case HttpRoutes.UPLOAD_DOC:
      return handleUpload(parseReqBody<UploadDocRequest>(event.body));
    default:
      throw new Error("Unrecognized route");
  }
};

export const handle: APIGatewayProxyHandlerV2 = async (event) => {
  const response = await handleResponse(event);
  return {
    statusCode: 200,
    body: typeof response === "string" ? response : JSON.stringify(response),
  };
};
