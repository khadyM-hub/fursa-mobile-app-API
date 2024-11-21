import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { NextRequest } from "next/server";
import uniqid from 'uniqid';

export async function POST(req: NextRequest) {
  const data = await req.formData();
  const file = data.get('file') as File;

  // Initialize S3 Client
  const s3Client = new S3Client({
    region: 'eu-north-1',
    endpoint: "https://s3.eu-north-1.amazonaws.com", // Use the region-specific endpoint
    forcePathStyle: true, // Ensures bucket name is in the URL path
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY as string,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
    },
  });

  // Generate unique filename
  const newFilename = `${uniqid()}-${file.name}`;

  // Read file as buffer
  const chunks = [];
  // @ts-ignore
  for await (const chunk of file.stream()) {
    chunks.push(chunk);
  }
  const buffer = Buffer.concat(chunks);

  // Define bucket name
  const bucketName = 'job-api'; // Updated to the correct bucket name

  // Upload file to S3
  await s3Client.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: newFilename,
    ACL: 'public-read',
    Body: buffer,
    ContentType: file.type,
  }));

  // Return response
  return Response.json({
    newFilename,
    url: `https://${bucketName}.s3.eu-north-1.amazonaws.com/${newFilename}`,
  });
}
