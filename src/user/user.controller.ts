import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/role-guard/role-checker';
import { SameUserOrHasRoleGuard } from 'src/auth/guards/role-guard/same-user-or-has-role.guard';
import { BearerAuth } from 'src/docs';
import { ADMIN } from 'src/roles/roles';
import { DeleteResult } from 'typeorm';
import { User } from './entities/user-entity';
import { UserService } from './user.service';
import { UpdateUserDTO } from './dtos.ts/update-user-dto';

@ApiTags('Пользователи')
@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) { }
    
    @ApiOperation({ summary: 'Получи всех пользователей' })
    @ApiResponse({ status: 200, type: [User] })
    @Get('')
    getAllUsers() {
        return this.userService.findAll();
    }

    @ApiOperation({ summary: 'Получи пользователя по id' })
    @ApiResponse({ status: 200, type: User })
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id пользователя. должно существовать в БД',
        type: Number
    })
    @Get('/:id')
    getOneUser(
        @Param('id', ParseIntPipe) id: number,
    ) {
        return this.userService.findById(id);
    }

    @Roles(ADMIN.value)
    @UseGuards(SameUserOrHasRoleGuard)
    @ApiBearerAuth(BearerAuth)
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id пользователя. должно существовать в БД',
        type: Number
    })
    @ApiOperation({ summary: 'Обнови информацию о пользователе' })
    @ApiResponse({ status: 200, type: User })
    @Patch('/:id')
    update(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: UpdateUserDTO,
    ) {
        return this.userService.update(id, dto);

    }
    
    @Roles(ADMIN.value)
    @UseGuards(SameUserOrHasRoleGuard)
    @ApiBearerAuth(BearerAuth)
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id пользователя. должно существовать в БД',
        type: Number
    })
    @ApiOperation({ summary: 'Удали пользователя' })
    @ApiResponse({ status: 200, type: DeleteResult })
    @Delete('/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.userService.delete(id);
    }
}
