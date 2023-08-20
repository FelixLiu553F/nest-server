import { Controller, UseInterceptors } from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { nanoid } from 'nanoid';
import path from 'path';
import { Express } from 'express';
import { SUPPORT_FILE_EXTENSION } from 'src/configs/file.config';

@Controller('file')
export class FileController {
  constructor(private fileService: FileService) {}

  @UseInterceptors(FileInterceptor('file'))
  async upload(file: Express.Multer.File) {
    if (file instanceof Promise) {
      file = await file;
    }

    const mime = `.${file.mimetype?.split('/').pop()}`.toLowerCase();
    const filename = file.filename;
    const extname = path.extname(filename).toLocaleLowerCase();

    if (
      !SUPPORT_FILE_EXTENSION.includes(extname) &&
      !SUPPORT_FILE_EXTENSION.includes(mime)
    ) {
      throw new Error('Unsupported file extension');
    }
    const key = `upload/${Date.now()}-${nanoid(5)}${extname}`;
    return await this.fileService.uploader.upload(
      key,
      file.stream,
      file.mimetype,
    );
  }
}
