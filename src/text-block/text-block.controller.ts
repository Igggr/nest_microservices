import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TextBlockService } from './text-block.service';


@ApiTags('Текстовый блок')
@Controller('text-block')
export class TextBlockController {
    constructor(
        private readonly textBlockService: TextBlockService,
    ) { }
    
    @ApiOperation({ summary: 'Создание нового текстового блока' })
    @Post('/')
    create(@UploadedFile() file) {
        this.textBlockService.createFile(file);
        console.log('create text block');
    }
    
    @ApiOperation({ summary: 'Получение тестовых блоков'})
    @Get('/')
    getGroup() {
        console.log('Get info about text-blocks');
    }

    @ApiOperation({ summary: 'Получение конкретного текстового блока' })
    @Get('/:id')
    getOne(@Param('id', ParseIntPipe) id: number) {
        console.log(`Get info about text block with id=${id}`);
    }

    @ApiOperation({ summary: 'Обновление конкретного текстового блока' })
    @Patch('/:id')
    update(@Param('id', ParseIntPipe) id: number) {
        console.log(`Update text-block id=${id}`);
    }
    
    @ApiOperation({ summary: 'Удаление конкретного текстового блока' })
    @Delete('/:id')
    delete(@Param('id', ParseIntPipe) id: number) {
        console.log(`Delete text-block id=${id}`);
    }

}
