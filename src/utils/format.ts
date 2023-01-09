import { APIGatewayProxyEventV2 } from "aws-lambda";
import { RequestData } from "../interface/httpRoutes";
import { CustomError } from "./customError";

const parseReqBody = (body: string): unknown => {
  try {
    return JSON.parse(body);
  } catch {
    // Only json is supported as of now
    // Could handle other content types if needed
    throw new CustomError({
      name: "BadRequestException",
      message: "Invalid Request Body",
      statusCode: 400,
    });
  }
};

// TODO: schema or DTO validation
export const extractReqData = (
  event: APIGatewayProxyEventV2
): RequestData | Record<string, never> => {
  const { body, queryStringParameters, pathParameters } = event;

  return {
    ...(body && { body: parseReqBody(body) }),
    ...(queryStringParameters && { queryStringParameters }),
    ...(pathParameters && { pathParameters }),
  };
};

export const handleResponse = (response: object) => {
  return {
    statusCode: 200,
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};

export const handleError = (e: CustomError) => {
  const errorMessage = e.message || "Internal Server Error";
  return {
    statusCode: e.statusCode || 500,
    isBase64Encoded: false,
    headers: {
      "Content-Type": "application/json",
      "x-amzn-ErrorType": e.name || "Error",
    },
    body: JSON.stringify({ message: errorMessage }),
  };
};
