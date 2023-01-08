import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../clients/s3-client";
import { UploadDocRequest, UploadDocResponse } from "../interface/uploadDoc";

export const handleUpload = async (
  body: UploadDocRequest
): Promise<UploadDocResponse> => {
  if (!body?.fileName) {
    throw new Error("Missing fileName");
  }
  const putObjectCommand = new PutObjectCommand({
    Bucket: process.env.BUCKET,
    Key: body.fileName,
  });
  const putUrl = await getSignedUrl(s3Client, putObjectCommand, {
    expiresIn: 400000,
  });
  return { putUrl };
};
