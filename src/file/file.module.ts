import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileRecord } from './entities/file-entity';
import { FileService } from './file.service';
import { FileController } from './file.controller';

@Module({
  providers: [FileService],
  exports: [FileService],
  imports: [
    TypeOrmModule.forFeature([FileRecord]),
  ],
  controllers: [FileController]
})
export class FileModule {}
