export const STORAGE_ADAPTER = process.env.STORAGE_ADAPTER;
export const STORAGE_WITHOUT_HOST = process.env.STORAGE_WITHOUT_HOST;
export const STORAGE_PATH = process.env.STORAGE_PATH;
export const SUPPORT_FILE_EXTENSION = [
  '.xlsx',
  '.xls',
  '.csv',
  '.ico',
  '.gif',
  '.jpg',
  '.jpeg',
  '.bmp',
  '.png',
  '.webp',
  '.svg',
  '.zip',
  '.ogg',
  '.mp3',
  '.wav',
  '.mp4',
  '.flv',
  '.mov',
];

// Minio
export const MINIO_HOST = process.env.MINIO_HOST;
export const MINIO_PORT = process.env.MINIO_PORT;
export const MINIO_ACCESS_KEY_ID = process.env.MINIO_ACCESS_KEY_ID;
export const MINIO_ACCESS_KEY = process.env.MINIO_ACCESS_KEY;
export const MINIO_BUCKET = process.env.MINIO_BUCKET;
export const MINIO_PATH =
  process.env.MINIO_PATH ?? `${MINIO_HOST}:${MINIO_PORT}/${MINIO_BUCKET}`;
