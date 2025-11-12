import { PutObjectCommand, PutObjectCommandOutput, S3Client } from "@aws-sdk/client-s3";

export async function uploadToS3(
  file: File
): Promise<{ file_key: string; file_name: string }> {
  try {
    const s3 = new S3Client({
      region: "ap-southeast-1",
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY!,
      },
    });

    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    });

    await s3.send(command);

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    throw error;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.ap-southeast-1.amazonaws.com/${file_key}`;
  return url;
}