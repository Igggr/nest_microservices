import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as uuid from 'uuid';
import * as path from 'path';


@Injectable()
export class FileService {
    async createFile(file, extension = 'jpg'): Promise<string> {
        try {
            const fileName = uuid.v4() + '.' + extension;
            const filePath = path.join(this.staticDirectory, fileName);
            
            this.ensureDirectory(this.staticDirectory);
            fs.writeFileSync(filePath, file.buffer);

            return fileName;
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
