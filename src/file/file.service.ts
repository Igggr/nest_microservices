import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as path from 'path';


@Injectable()
export class FileService {
    async createFile(file, extension = 'jpg'): Promise<string> {
        try {
            const fileName = uuid.v4() + '.' + extension;
            const directory = path.resolve(__dirname, '..', '..', 'static');  //  cd ../../static
            const filePath = path.join(directory, fileName);
            
            this.ensureDirectory(directory);
            fs.writeFileSync(filePath, file.buffer);

            return fileName;
        } catch (e) {
            throw new HttpException('Произошла ошибка при записи файла', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    ensureDirectory(direcory: string) {
        if (!fs.existsSync(direcory)) {
            fs.mkdirSync(direcory, { recursive: true })
        }
    }

    deleteFile(fileName: string) {
        console.log(`Deleteing ${fileName}`);
        const filePath = path.resolve(__dirname, '..', '..', 'static', fileName);
        fs.unlinkSync(filePath);
    }
}
