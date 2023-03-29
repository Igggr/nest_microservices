import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.service';
import { CreateTextBlockDTO } from 'src/text-block/dtos/create-text-block.dto';
import { BlockGroup } from 'src/text-block/entities/block-group-entity';
import { TextBlock } from 'src/text-block/entities/text-block-entity';
import { Connection, Repository } from 'typeorm';
import { GroupService } from '../group/group.service';


@Injectable()
export class TextBlockService {
    constructor(
        private readonly fileService: FileService,
        private readonly groupService: GroupService,
        private readonly connection: Connection,  // транзакции
        @InjectRepository(TextBlock)
        private readonly textBlockRepository: Repository<TextBlock>,
        @InjectRepository(BlockGroup)
        private readonly blockGroupRepository: Repository<BlockGroup>,

    ) { }
    
    async create(dto: CreateTextBlockDTO, file) {
        console.log(dto);
        const fileName = await this.fileService.createFile(file);
        console.log(`Created file ${fileName}`);
        const group = await this.groupService.ensureGroup(dto.groupName);
        const textBlock = this.textBlockRepository.create({ title: dto.title, text: dto.text, image: fileName });

        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            if (!group.id) {
                console.log('Групппа не существовала. создаем');
                await queryRunner.manager.save(group);
            }
            console.log('saved group');
            console.log(group);
            await queryRunner.manager.save(textBlock);
            console.log('saved block')
            console.log(textBlock);
            
            const blockgroup = this.blockGroupRepository.create({ block: textBlock, group: group });
            console.log(blockgroup);
            await queryRunner.manager.save(blockgroup);
            console.log('saved relationship');

            await queryRunner.commitTransaction();
            return blockgroup;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            this.fileService.deleteFile(fileName);
            throw new HttpException('Не удалось сохранить', HttpStatus.BAD_REQUEST);
        } finally {
            await queryRunner.release();
        }

    }

}
