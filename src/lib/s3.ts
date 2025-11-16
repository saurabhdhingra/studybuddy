import {  S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  try {
    const s3 = new S3Client({
      region: "ap-south-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY_ID!,
      },
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const parallelUploads = new Upload({
      client: s3,
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
        Key: file_key,
        Body: file,
        ContentType: file.type,
      },


      // Recommended for better multipart performance
      queueSize: 4,
      partSize: 5 * 1024 * 1024, // 5MB part size
    });

    await parallelUploads.done();

    // Return the required data for your mutation
    return { file_key, file_name: file.name };
  } catch (error) {
    throw error;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-south-1.amazonaws.com/${file_key}`;
  return url;
}