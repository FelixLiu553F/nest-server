import path from 'path';
import { STORAGE_PATH, STORAGE_WITHOUT_HOST } from 'src/configs/file.config';
import { Readable } from 'stream';
import fs from 'fs';
import { fusionxPath, fusionxURL } from 'src/common/utils/file.util';

async function upload(key: string, inputStream: Readable) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
  fs.mkdirSync(path.resolve(STORAGE_PATH, path.dirname(key)), {
    recursive: true,
  });
  const stream = fs.createWriteStream(path.resolve(STORAGE_PATH, key));
  inputStream.pipe(stream);
  if (STORAGE_WITHOUT_HOST) {
    return fusionxPath(`/files/${key}`);
  } else {
    return fusionxURL(`/files/${key}`);
  }
}

export default upload;
