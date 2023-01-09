import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../clients/s3-client";
import { GetObjectUrlResponse } from "../interface/documents";
import type { RouteHandler } from "../interface/httpRoutes";

export const handleGetObjectUrl: RouteHandler<GetObjectUrlResponse> = async (
  data
) => {
  const fileName = data.queryStringParameters?.fileName;
  if (!fileName) {
    throw new Error("Missing queryStringParams - fileName");
  }
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: fileName,
  });
  const getUrl = await getSignedUrl(s3Client, getObjectCommand, {
    expiresIn: +process.env.EXPIRES_IN,
  });
  return { getUrl };
};
