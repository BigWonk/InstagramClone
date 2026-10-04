import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { randomUUID } from 'crypto';
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import pool from "../index.js"




async function storeImageR2(fileName, contentType)
{
const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL; // Ensure no trailing '/'
const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
   
    try {
   
    if (!fileName) throw new Error('fileName and contentType required');
    
    const objectKey = `${randomUUID()}-${fileName}`;
    const publicFileUrl = R2_PUBLIC_BASE_URL ? `${R2_PUBLIC_BASE_URL}/${objectKey}` : null;

    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: objectKey,
      ContentType: contentType,
    });
    const presignedUrl = await getSignedUrl(s3, command, { expiresIn: 3000 });
    
    return { success: true, presignedUrl, objectKey, publicFileUrl }

} catch (error) {
    console.error('Presign Error:', error.message);
    return { success: false, error: 'Failed to prepare upload' }
  }
}

async function storeMetadataNeon(objectKey, publicFileUrl, userId) {
    const R2_ENDPOINT = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const R2_BUCKET = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL; // Ensure no trailing '/'
const s3 = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
    
    
    try {
        const finalFileUrl =
            publicFileUrl ||
            (R2_PUBLIC_BASE_URL ? `${R2_PUBLIC_BASE_URL}/${objectKey}` : 'URL not available');

        const result = await pool.query(
            `INSERT INTO r2_files (object_key, file_url, user_id)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [objectKey, finalFileUrl, userId]
        );

        return { result: result.rows };
    } 
    catch (error) 
    {
        console.error(error);
        throw error;
    }
}


export const storeImage = storeImageR2
export const storeMetadata = storeMetadataNeon