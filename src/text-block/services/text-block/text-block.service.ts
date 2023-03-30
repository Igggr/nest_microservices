import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/file/file.service';
import { CreateTextBlockDTO } from 'src/text-block/dtos/create-text-block.dto';
import { UpdateTextBlockDTO } from 'src/text-block/dtos/update-text-block.dto';
import { TextBlock } from 'src/text-block/entities/text-block-entity';
import { DataSource, Equal, Repository } from 'typeorm';
import { GroupService } from '../group/group.service';


@Injectable()
export class TextBlockService {
    constructor(
        private readonly fileService: FileService,
        private readonly groupService: GroupService,
        private readonly dataSource: DataSource,  // транзакции
        @InjectRepository(TextBlock)
        private readonly textBlockRepository: Repository<TextBlock>,
    ) { }
    
    async create(dto: CreateTextBlockDTO, file) {
        const image = this.fileService.generateName('jpg');
        const group = await this.groupService.ensureGroup(dto.groupName);
        const textBlock = this.textBlockRepository.create({ title: dto.title, text: dto.text, image });

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            if (!group.id) {
                console.log('Групппа не существовала. создаем');
                await queryRunner.manager.save(group);
            }
            textBlock.group = group;
            await queryRunner.manager.save(textBlock);

            const record = await this.fileService.createFileAndRecord(textBlock.id, 'TextBlock', file, 'jpg');

            await queryRunner.manager.save(record);

            await queryRunner.commitTransaction();
            return textBlock;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            this.fileService.deleteFile(image);
            throw new HttpException('Не удалось сохранить', HttpStatus.BAD_REQUEST);
        } finally {
            await queryRunner.release();
        }

    }

    async findById(id: number) {
        const textBlock = this.textBlockRepository.findOne({ where: { id: Equal(id) } });
        return textBlock;
    }

    async find(groupName?: string) {
        if (groupName) {
            return this.textBlockRepository.find({
                where:
                    { group: { groupName: Equal(groupName) } }
            });
        } else {
            return this.textBlockRepository.find();
        }
    }

    async update(id: number, dto: UpdateTextBlockDTO, image) {


        let block = await this.findById(id);

        if (!block) {
            throw new HttpException(`Блока с id=${id} не существует`, HttpStatus.NOT_FOUND);
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {

            if (dto.groupName) {
                const group = await this.groupService.ensureGroup(dto.groupName);
                block.group = group;
                await queryRunner.manager.save(group);
            }
            
            block.title = dto.title ?? block.title;
            block.text = dto.text ?? block.text;

            let oldImage: string;
            if (image) {
                oldImage = block.image;
                block.image = this.fileService.generateName();
                const fileRecord = await this.fileService.createFileAndRecord(block.id, 'TextBlock', image, block.image);
                await queryRunner.manager.save(fileRecord);
            }

            block = await queryRunner.manager.save(block);
            await queryRunner.commitTransaction();

            if (image) {
                this.fileService.deleteFile(oldImage);
                console.log('Удалили старое изображение');
            }
            
            return block;
        } catch (e) {
            console.log(e);
            await queryRunner.rollbackTransaction();
            throw new HttpException('Не удалось обновить текстовый блок', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            await queryRunner.release();
        }
    }

    async delete(id: number) {
        return await this.textBlockRepository.delete(id);    
    }

}
