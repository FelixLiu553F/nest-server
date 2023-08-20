import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import minioUploader from './adapters/minio';
import {
  STORAGE_WITHOUT_HOST,
  STORAGE_ADAPTER,
  MINIO_PATH,
} from 'src/configs/file.config';
import localUploader from './adapters/local';
import { fusionxPath, fusionxURL } from '../utils/file.util';

export type UploadAdapter = (
  key: string,
  stream: Readable,
  contentType?: string,
) => Promise<string>;

const adapters = {
  LOCAL: {
    upload: localUploader,
    rootPath: () => {
      if (STORAGE_WITHOUT_HOST) {
        return fusionxPath(`/files`);
      } else {
        return fusionxURL(`/files`);
      }
    },
  },
  MINIO: {
    upload: minioUploader,
    rootPath: () => MINIO_PATH,
  },
};

@Injectable()
export class FileService {
  public uploader: {
    upload: UploadAdapter;
    rootPath: () => string;
  };

  constructor() {
    this.uploader =
      adapters[
        (STORAGE_ADAPTER?.toUpperCase() as keyof typeof adapters) ?? 'LOCAL'
      ];
  }
}
