import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsS3Service {
  private s3Client: S3Client;

  constructor() {
    const AWS_REGION = process.env.AWS_REGION;
    const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;

    if (!AWS_REGION || !AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY) {
      throw new InternalServerErrorException('Invalid Configuration');
    }
    this.s3Client = new S3Client({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });
  }

  async getPresignedPostUrl(userId: string, contentType: string) {
    try {
      const bucketName = String(process.env.AWS_S3_BUCKET_NAME);
      if(!bucketName || typeof bucketName !== 'string'){
        throw new InternalServerErrorException('Invalid Configuration!');
      }

      const key = `upload/user_${userId}/${uuidv4()}`;

      const { url, fields } = await createPresignedPost(this.s3Client, {
        Bucket: bucketName,
        Key: key,
        Conditions: [
          ['content-length-range', 0, 512000], // Strictly 500KB limit
          ['starts-with', '$Content-Type', 'image/'], // Only allow image mime types
        ],
        Fields: {
            'Content-Type': contentType,
        },
        Expires: 60,
      });
      return {
        url,
        fields,
        s3key: key
      }
    } catch (error) {
      console.error('S3 Presigned Post Error:', error);
      throw new InternalServerErrorException(
        'Could not generate secure upload URL',
      );
    }
  }

  async getContentDownloadUrl(s3Key: string): Promise<string>{
    try{
      const bucketName = String(process.env.AWS_S3_BUCKET_NAME);
      if(!bucketName || typeof bucketName !== 'string'){
        throw new InternalServerErrorException('Invalid Configuration!');
      }
      const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: s3Key,
      });
      const signedUrl = await getSignedUrl(this.s3Client, command, { 
        expiresIn: 3600 
      });
      return signedUrl;
    } catch (error){
        console.error('Error generating GET presigned URL:', error);
      throw new InternalServerErrorException('Could not generate image viewing link');
    }
  }
}
