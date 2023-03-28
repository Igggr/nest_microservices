import { Controller, Delete, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user-entity';
import { UserService } from './user.service';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }
    
    @ApiOperation({ summary: 'Получи всех пользователей' })
    @ApiResponse({ status: 200, type: [User]})
    @Get('')
    getAllUserrs() {
        return this.userService.findAll();
    }
    
    @ApiOperation({ summary: 'Удали пользователя' })
    @ApiResponse({ status: 200 })
    @Delete('/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        this.userService.delete(id);
    }
}
