import { Injectable } from '@nestjs/common';
import { FileService } from 'src/file/file.service';

@Injectable()
export class TextBlockService {
    constructor(
        private readonly fileService: FileService,
    ) { }
    
    async createFile(file) {
        const fileName = await this.fileService.createFile(file);
        console.log(`Created file ${fileName}`);
    }
}
