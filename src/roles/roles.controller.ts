import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDTO } from './dtos/role-dto';
import { Role } from './entities/role-entity';

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    constructor(
        private readonly roleService: RolesService,
    ) { }

    @ApiOperation({ summary: 'Создай роль' })
    @ApiResponse({ status: 200, type: Role })
    @Post('/')
    async createRole(@Body() dto: CreateRoleDTO) {
        return await this.roleService.create(dto);
    }

    @ApiOperation({ summary: 'Получи все роли' })
    @ApiResponse({ status: 200, type: [Role] })
    @Get('/')
    async getAllRoles() {
        return await this.roleService.findAll();
    }

}
