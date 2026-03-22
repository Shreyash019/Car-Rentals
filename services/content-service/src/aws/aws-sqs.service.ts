import {
  Injectable,
  OnModuleInit,
  InternalServerErrorException,
} from '@nestjs/common';
import {
  SQSClient,
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from '@aws-sdk/client-sqs';

@Injectable()
export class AwsSqsService implements OnModuleInit {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor() {
    const AWS_REGION = process.env.AWS_REGION;
    const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
    const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
    const AWS_SQS_QUEUE_URL = process.env.AWS_SQS_QUEUE_URL;

    if (
      !AWS_REGION ||
      !AWS_ACCESS_KEY_ID ||
      !AWS_SECRET_ACCESS_KEY ||
      !AWS_SQS_QUEUE_URL
    ) {
      throw new InternalServerErrorException('Invalid Configuration');
    }

    this.sqsClient = new SQSClient({
      region: AWS_REGION,
      credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
      },
    });

    this.queueUrl = AWS_SQS_QUEUE_URL;
  }

  onModuleInit() {
    this.pollQueue();
  }

  private async pollQueue() {
    console.log('Started polling SQS for S3 upload events...');
    
    // Create an infinite loop to continuously check the queue
    while (true) {
      try {
        const command = new ReceiveMessageCommand({
          QueueUrl: this.queueUrl,
          MaxNumberOfMessages: 5,
          WaitTimeSeconds: 20, // Long polling: wait 20s for a message to arrive before looping. Highly cost-effective.
        });

        const response = await this.sqsClient.send(command);

        if (response.Messages) {
          for (const message of response.Messages) {
            await this.processMessage(message);
          }
        }
      } catch (error) {
        console.error('Error polling SQS:', error);
        // Wait a bit before retrying to prevent spamming logs on failure
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  private async processMessage(message: any) {
    // 1. S3 wraps its event payload in a JSON string
    const body = JSON.parse(message.Body);
    console.log("Records:", body.Records)
    console.log("Records:", body.Records[0].s3);
    
    // 2. A single SQS message might contain multiple S3 events (Records)
    if (body.Records) {
      for (const record of body.Records) {
        const s3Key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
        const fileSize = record.s3.object.size;

        console.log(`✅ Success! S3 confirmed file uploaded: ${s3Key} (${fileSize} bytes)`);
        
        // ==========================================
        // SYSTEM DESIGN NOTE: 
        // This is exactly where you write the SQL query 
        // to update the user's profile picture path in the database.
        // ==========================================
      }
    }

    // 3. Delete the message from the queue so we don't process it again
    const deleteCommand = new DeleteMessageCommand({
      QueueUrl: this.queueUrl,
      ReceiptHandle: message.ReceiptHandle,
    });
    
    await this.sqsClient.send(deleteCommand);
  }
}
