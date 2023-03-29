import { Module } from '@nestjs/common';
import { FileModule } from 'src/file/file.module';
import { TextBlockController } from './text-block.controller';
import { TextBlockService } from './text-block.service';

@Module({
  controllers: [TextBlockController],
  providers: [TextBlockService],
  imports: [
    FileModule,
  ]
})
export class TextBlockModule {}
