import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client } from "../clients/s3-client";
import { GetDocResponse } from "../interface/getDoc";

export const handleGetObjectUrl = async (
  fileName?: string
): Promise<GetDocResponse> => {
  if (!fileName) {
    throw new Error("Missing queryStringParams - fileName");
  }
  const getObjectCommand = new GetObjectCommand({
    Bucket: process.env.BUCKET,
    Key: fileName,
  });
  const getUrl = await getSignedUrl(s3Client, getObjectCommand, {
    expiresIn: 400000,
  });
  return { getUrl };
};
