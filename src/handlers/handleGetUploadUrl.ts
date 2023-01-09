import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../clients/s3-client";
import { GetUploadUrlResponse } from "../interface/documents";
import type { RouteHandler } from "../interface/httpRoutes";

export const handleGetUploadUrl: RouteHandler<GetUploadUrlResponse> = async (
  data
) => {
  if (!data.body?.fileName) {
    throw new Error("Missing fileName");
  }
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: data.body.fileName,
  });
  const putUrl = await getSignedUrl(s3Client, putObjectCommand, {
    expiresIn: +process.env.EXPIRES_IN,
  });
  return { putUrl };
};
