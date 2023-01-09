import { QsParams, RequestBody } from "./documents";

export enum HttpRoutes {
  UPLOAD_DOC = "PUT /file/put",
  GET_DOC_BY_NAME = "GET /file/get",
}

export interface RequestData {
  body?: RequestBody;
  queryStringParameters?: QsParams;
  pathParameters?: Record<string, string>;
}

export type RouteHandler<T> = (data: RequestData) => Promise<T>;
