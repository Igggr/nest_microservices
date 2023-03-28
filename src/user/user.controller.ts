import { Controller, Delete, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/guards/role/role-checker';
import { SameUserOrHasRoleGuard } from 'src/auth/guards/role/same-user-or-has-role.guard';
import { Role } from 'src/roles/entities/role-entity';
import { ADMIN } from 'src/roles/roles';
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
    
    @Roles(ADMIN)
    @UseGuards(SameUserOrHasRoleGuard)
    @ApiOperation({ summary: 'Удали пользователя' })
    @ApiResponse({ status: 200 })
    @Delete('/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        this.userService.delete(id);
    }
}
