import { BadRequestException, Module } from '@nestjs/common';
import { CommonService } from './common.service';
import { CommonController } from './common.controller';
import { MulterModule } from '@nestjs/platform-express';
import { extname } from 'path';
import * as multer from 'multer';
import { TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import {v4 as uuid} from 'uuid';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 1000000,
      },
      fileFilter: (req, file, cb) => {
        const ext = extname(file.originalname);
        if (ext !== '.jpg' && ext!=='.jpeg' && ext!=='.png' && ext!=='.pdf' && ext!=='.docx') {
          return cb(
            new BadRequestException('사진 또는 문서 파일만 업로드 가능합니다.'),
            false
          );
        }
        return cb(null, true);
      },
      storage: multer.diskStorage({
        destination: function(req, res, cb) {
          cb(null, TEMP_FOLDER_PATH);
        },
        filename: function(req, file, cb) {
          cb(null, `${uuid()}${extname(file.originalname)}`)
        }
      })
    })
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
