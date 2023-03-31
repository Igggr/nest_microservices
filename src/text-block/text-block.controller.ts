import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateTextBlockDTO } from './dtos/create-text-block.dto';
import { TextBlockService } from './services/text-block/text-block.service';
import { TextBlock } from './entities/text-block-entity';
import { DeleteResult } from 'typeorm';
import { UpdateTextBlockDTO } from './dtos/update-text-block.dto';
import { RoleGuard } from 'src/auth/guards/role-guard/role.guard';
import { ADMIN } from 'src/roles/roles';
import { Roles } from 'src/auth/guards/role-guard/role-checker';
import { BearerAuth } from 'src/docs';


@ApiTags('Текстовый блок')
@Controller('text-block')
export class TextBlockController {
    constructor(
        private readonly textBlockService: TextBlockService,
    ) { }

    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(RoleGuard)
    @Roles(ADMIN)
    @ApiBearerAuth(BearerAuth)
    @ApiOperation({ summary: 'Создание нового текстового блока' })
    @ApiResponse({ status: 200, type: TextBlock })
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
    @ApiResponse({ status: 200, type: [TextBlock] })
    @Get('/')
    getGroup(@Query('group') group: string) {
        return this.textBlockService.find(group);
    }

    @ApiParam({
        name: 'id',
        required: true,
        description: 'id текстового блока. должно существовать в БД',
        type: Number
    })
    @ApiOperation({ summary: 'Получение конкретного текстового блока' })
    @ApiResponse({ status: 200, type: TextBlock })
    @Get('/:id')
    getOne(@Param('id', ParseIntPipe) id: number) {
        return this.textBlockService.findById(id);
    }

    @UseInterceptors(FileInterceptor('image'))
    @UseGuards(RoleGuard)
    @Roles(ADMIN)
    @ApiBearerAuth(BearerAuth)
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id текстового блока. должно существовать в БД',
        type: Number
    })
    @ApiOperation({ summary: 'Обновление конкретного текстового блока' })
    @ApiResponse({ status: 200, type: TextBlock })
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
    @ApiBearerAuth(BearerAuth)
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id текстового блока. должно существовать в БД',
        type: Number
    })
    @ApiOperation({ summary: 'Удаление конкретного текстового блока' })
    @ApiResponse({ status: 200, type: DeleteResult })
    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number) {
        const res = await this.textBlockService.delete(id);
        return res;
    }

}
