import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';

@ApiTags('file')
@Controller('file')
export class FileController {
    constructor(
        private readonly fileService: FileService,
    ) { }
    
    @Get('')
    async getAll() {
        return this.fileService.join();
    }
}
