import { APIGatewayProxyEventV2 } from "aws-lambda";
import { RequestData } from "../interface/httpRoutes";

const parseReqBody = (body: string): unknown => {
  try {
    return JSON.parse(body);
  } catch {
    // Only json is supported as of now
    // Could handle other content types if needed
    throw new Error("Invalid request body, only json supported");
  }
};

// TODO: schema or DTO validation
export const extractReqData = (
  event: APIGatewayProxyEventV2
): RequestData | {} => {
  const { body, queryStringParameters, pathParameters } = event;

  return {
    ...(body && { body: parseReqBody(body) }),
    ...(queryStringParameters && { queryStringParameters }),
    ...(pathParameters && { pathParameters }),
  };
};

export const handleResponse = (response: Record<string, any>) => {
  return {
    statusCode: 200,
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};

export const handleError = (e: Error) => {
  return {
    statusCode: 500,
    isBase64Encoded: false,
    headers: {
      "Content-Type": "text/plain",
      "x-amzn-ErrorType": e.name || "Error",
    },
    body: e.message || "Internal Server Error",
  };
};
