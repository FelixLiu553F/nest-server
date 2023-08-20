import { Logger } from '@nestjs/common';
import { Client } from 'minio';
import {
  MINIO_HOST,
  MINIO_PORT,
  MINIO_ACCESS_KEY_ID,
  MINIO_ACCESS_KEY,
  MINIO_BUCKET,
  MINIO_PATH,
} from 'src/configs/file.config';
import { Readable } from 'stream';

const minioClient = new Client({
  endPoint: MINIO_HOST,
  port: +(MINIO_PORT ?? 9000),
  useSSL: false,
  accessKey: MINIO_ACCESS_KEY_ID,
  secretKey: MINIO_ACCESS_KEY,
});

async function upload(
  key: string,
  inputStream: Readable,
  contentType?: string,
) {
  try {
    await minioClient.putObject(MINIO_BUCKET, key, inputStream, {
      'Content-Type': contentType,
    });
  } catch (error) {
    new Logger().error(error);
  }
  return MINIO_PATH + '/' + key;
}

export default upload;
