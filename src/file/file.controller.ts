import { Controller, Delete, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';

@ApiTags('file')
@Controller('file')
export class FileController {
    constructor(
        private readonly fileService: FileService,
    ) { }
    
    @ApiOperation({
        summary: '"join" запись из таблицы FileRecord по "составному FOREIGN key" с соотвтсвующей ее записью из "essenceTab;e"'
    })
    @Get('')
    async getAll() {
        return this.fileService.join();
    }

    @Delete('')
    async removeOrphan() {
        await this.fileService.removeOrphanRecords();
    }

    @Delete('/other-trash')
    async removeOtherTrash() {
        return await this.fileService.removeOtherTrash();
    }
}
