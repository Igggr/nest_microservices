import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { FileRecord } from './entities/file-entity';
import { Brackets, In, Repository } from 'typeorm';


@Injectable()
export class FileService {
    constructor(
        @InjectRepository(FileRecord)
        private readonly fileRecord: Repository<FileRecord>,
    ) { }
    
    private async joinedTablesNames(): Promise<string[]> {
        const tables = await this.fileRecord.createQueryBuilder('file')
            .select('file.essenceTable name')
            .distinct()
            .getRawMany();
        return tables.map((table) => table.name);
    }

    // следуя заданию - удалени ненужных файлов должно быть таким.
    // Я однако считаю задание некорекктным, озможна ситация, когда
    // 1) в essenceTable / essenceId заполнены, но соответсвующей им строки (essenceTable.id = essenceId) не существует
    // 2) а вдруг данные о имени фала в FileRecord и essenceTable разойдутся?
    // 3) надо воюще говоря проверить все файлы в директории - а каждому ли соостветсвует запись в FileRecord?
    //
    // поэому в дополнение написан метод removeOtherTrash
    async removeOrphanRecords() {
        // кривовато. Но подружить DATE_DIFF с TYpeORM пока не удалось         
        const records = await this.fileRecord
            .createQueryBuilder('record')
            .where("record.createdAt + interval '1' hour < NOW()")   // прошло больше час с момента создания
            .andWhere(
                new Brackets((qb) =>
                    qb.where('record.essenceTable IS null')    // а при этом связей ни с кем нет
                        .orWhere('record.essenceId IS null')   //
                )
            )
            .getMany();
        
        const removeFiles = records.map((record) => this.deleteFile(record.filePath));
        await Promise.all(removeFiles);
        
        return await this.fileRecord.remove(records);
    }

    // Как мне кажется надо удалять файлы - 
    // 1) essenceTable IS null
    // 2) essenceId Is null
    // 3) в essenceTable нет строки с id = essenceID
    // 4) такая строка есть, но имя файла там храниться другое
    async removeOtherTrash() {
        const rows = await this.join();

        const removeRows = rows
            .filter((row) => (
                // essenceId === null or essenceTable === nul or в esssenceTable просто нет строки с id = essnceId
                row.ref_id === null    

                // данные не консистентныa. Хотя черт знает - может в этом случае стоит переписать одно значени другим?
                || row.record_file_path !== row.ref_file_path  
            ));

        const filesRemoval = removeRows.map((row) => this.deleteFile(row.record_file_path));
        await Promise.all(filesRemoval);
       
        return this.fileRecord.delete({id: In(removeRows.map((row) => row.id)) })        
    }


    // все таблицы обязаны иметь одну и ту же колонку длч хранения имени файла - image
    async join() {
        const tables = await this.joinedTablesNames();
            
        const res = tables
            .map((tableName) =>
                this.fileRecord
                    .createQueryBuilder('file')
                    .leftJoinAndSelect(tableName, "table", "table.id = file.essenceId")
                    .where('file.essenceTable = :tableName', { tableName })
                    .select([
                        'file.id as id',
                        'file.essenceTable as ref_table',
                        'table.id as ref_id',
                        'file.createdAt as createdAt',
                        'file.filePath as record_file_path',
                        'table.image as ref_file_path',
                    ]).getRawMany()
            );
        
        return (await Promise.all(res)).flatMap((row) => row);
    }
    
    async createFileAndRecord(id: number, tableName: string, file, filePath: string) {
        await this._writeFile(file, filePath);
        const record = await this.fileRecord.create({ essenceId: id, essenceTable: tableName, filePath });
        return record
    }

    generateName(extension = 'jpg'): string {
        const fileName = uuid.v4() + '.' + extension;
        return fileName;
    }

    private async _writeFile(file, fileName: string): Promise<void> {
        try {
            const filePath = path.join(this.staticDirectory, fileName);

            await this._ensureDirectory(this.staticDirectory);
            return new Promise<void>((resolve, reject) => {
                fs.writeFile(filePath, file.buffer, () => resolve());
            });
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    private async _ensureDirectory(direcory: string): Promise<void> {
        if (!fs.existsSync(direcory)) {
            return new Promise<void>((resolve, reject) => {
                fs.mkdir(direcory, { recursive: true }, () => resolve())
            });
        }
    }

    async deleteFile(fileName: string): Promise<void> {
        const filePath = path.resolve(this.staticDirectory, fileName);
        return new Promise<void>((resolve, reject) => {
            fs.unlink(filePath, () => resolve())
        })
       ;
    }

    private get staticDirectory(): string {
        return path.resolve(__dirname, '..', '..', 'static');
    }
}
