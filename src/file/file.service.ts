import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRecord } from './entities/file-entity';
import { Repository } from 'typeorm';


@Injectable()
export class FileService {
    constructor(
        @InjectRepository(FileRecord)
        private readonly fileRecord: Repository<FileRecord>,
    ) { }
    
    async foo() {
        return this.fileRecord
            .createQueryBuilder('file')
            .innerJoinAndSelect('file.essenceId', 'file.essenceTable.id')
            .getMany();
    }
    
    async createFileAndRecord(id: number, tableName: string, file, fileName: string) {
        this._createFile(file, fileName);
        const record = await this.fileRecord.create({ essenceId: id, essenceTable: tableName });
        return record
    }

    generateName(extension = 'jpg') {
        const fileName = uuid.v4() + '.' + extension;
        return fileName;
    }

    private _createFile(file, fileName: string) {
        try {
            const filePath = path.join(this.staticDirectory, fileName);
            
            this.ensureDirectory(this.staticDirectory);
            fs.writeFileSync(filePath, file.buffer);
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private ensureDirectory(direcory: string) {
        if (!fs.existsSync(direcory)) {
            fs.mkdirSync(direcory, { recursive: true })
        }
    }

    deleteFile(fileName: string) {
        const filePath = path.resolve(this.staticDirectory, fileName);
        fs.unlinkSync(filePath);
    }

    private get staticDirectory() {
        return path.resolve(__dirname, '..', '..', 'static');
    }
}
