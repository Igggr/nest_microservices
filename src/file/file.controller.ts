import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileService } from './file.service';
import { Roles } from 'src/auth/guards/role-guard/role-checker';
import { ADMIN } from 'src/roles/roles';
import { RoleGuard } from 'src/auth/guards/role-guard/role.guard';
import { BearerAuth } from 'src/docs';
import { DeleteResult } from 'typeorm';
import { FileRecord } from './entities/file-entity';

@ApiTags('Работа с файлами')
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

    @UseGuards(RoleGuard)
    @Roles(ADMIN.value)
    @ApiBearerAuth(BearerAuth)
    @ApiOperation({
        summary: 'Удаление лишних файлов так, как оно описано в задании - \
        essenceId/essenceTable пустые + прошло больше часа с момента создания'
    })
    @ApiResponse({status: 200, type: [FileRecord]})
    @Delete('')
    async removeOrphan() {
        return await this.fileService.removeOrphanRecords();
    }

    @UseGuards(RoleGuard)
    @Roles(ADMIN.value)
    @ApiBearerAuth(BearerAuth)
    @ApiOperation({
        summary: 'Удаление лишних файлов так, как мне кажется это надо делать - \
        essenceId/essenceTable пустые OR в essenceTable нет строки с id = essenceId \
        OR в этой строке хранится не такой путь'
    })
    @ApiResponse({ status:  200, type: DeleteResult})
    @Delete('/other-trash')
    async removeOtherTrash() {
        return await this.fileService.removeOtherTrash();
    }
}
