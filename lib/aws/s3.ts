import {
  ObjectCannedACL,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

export const s3 = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.AWS_ACC_ACCESS_KEY ?? "",
    secretAccessKey: process.env.AWS_ACC_SECRET_KEY ?? "",
  },
});

export const s3UploadFile = async (
  path: string,
  file: Buffer,
  bucket?: string,
  acl?: ObjectCannedACL,
  file_type?: string
) => {
  return s3.send(
    new PutObjectCommand({
      Bucket: bucket ?? process.env.AWS_S3_BUCKET ?? "",
      Body: file,
      Key: path,
      ServerSideEncryption: "AES256",
      ACL: acl ?? "public-read",
      ContentType: file_type,
    })
  );
};
