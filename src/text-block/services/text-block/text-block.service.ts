import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.service';
import { CreateTextBlockDTO } from 'src/text-block/dtos/create-text-block.dto';
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
            textBlock.group = group;
            await queryRunner.manager.save(textBlock);

            await queryRunner.commitTransaction();
            return textBlock;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            this.fileService.deleteFile(fileName);
            throw new HttpException('Не удалось сохранить', HttpStatus.BAD_REQUEST);
        } finally {
            await queryRunner.release();
        }

    }

}
