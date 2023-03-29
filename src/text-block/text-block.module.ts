import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from 'src/file/file.module';
import { BlockGroup } from './entities/block-group-entity';
import { Group } from './entities/group-entity';
import { TextBlock } from './entities/text-block-entity';
import { TextBlockController } from './text-block.controller';
import { TextBlockService } from './text-block.service';

@Module({
  controllers: [TextBlockController],
  providers: [TextBlockService],
  imports: [
    FileModule,
    TypeOrmModule.forFeature([Group, TextBlock, BlockGroup]),
  ]
})
export class TextBlockModule {}
