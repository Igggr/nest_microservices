import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTextBlockDTO } from './dtos/create-text-block.dto';
import { TextBlockService } from './services/text-block/text-block.service';
import { TextBlock } from './entities/text-block-entity';
import { DeleteResult } from 'typeorm';
import { UpdateTextBlockDTO } from './dtos/update-text-block.dto';
import { RoleGuard } from 'src/auth/guards/role-guard/role.guard';
import { ADMIN } from 'src/roles/roles';
import { Roles } from 'src/auth/guards/role-guard/role-checker';


@ApiTags('Текстовый блок')
@Controller('text-block')
export class TextBlockController {
    constructor(
        private readonly textBlockService: TextBlockService,
    ) { }
    
    @UseGuards(RoleGuard)
    @Roles(ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Создание нового текстового блока' })
    @ApiResponse({status: 200, type: TextBlock})
    @Post('/')
    async create(
        @Body() dto: CreateTextBlockDTO,
        @UploadedFile() image,
    ) {
        return await this.textBlockService.create(dto, image);
    }
    
    @ApiQuery({
        name: "group",
        type: String,
        description: "Group name. Optional",
        required: false
    })
    @ApiOperation({ summary: 'Получение тестовых блоков' })
    @ApiResponse({ status: 200, type: [TextBlock]})
    @Get('/')
    getGroup(@Query('group') group: string) {
        return this.textBlockService.find(group);
    }

    @ApiOperation({ summary: 'Получение конкретного текстового блока' })
    @ApiResponse({status: 200, type: TextBlock})
    @Get('/:id')
    getOne(@Param('id', ParseIntPipe) id: number) {
        return this.textBlockService.findById(id);
    }

    @UseGuards(RoleGuard)
    @Roles(ADMIN)
    @UseInterceptors(FileInterceptor('image'))
    @ApiOperation({ summary: 'Обновление конкретного текстового блока' })
    @ApiResponse({status: 200, type: TextBlock})
    @Patch('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateTextBlockDTO,
        @UploadedFile() image,
    ) {
        return await this.textBlockService.update(id, dto, image);
    }
    
    @UseGuards(RoleGuard)
    @Roles(ADMIN)
    @ApiOperation({ summary: 'Удаление конкретного текстового блока' })
    @ApiResponse({ status: 200, type: DeleteResult })
    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        const res = await this.textBlockService.delete(id);
        return res;
    }

}
