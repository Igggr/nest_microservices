import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ADMIN, RolesService } from './roles.service';
import { CreateRoleDTO } from './dtos/role-dto';
import { Role } from './entities/role-entity';
import { RoleGuard } from 'src/auth/guards/role/role.guard';
import { Roles } from 'src/auth/guards/role/roles-auth-decorator';

@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    constructor(
        private readonly roleService: RolesService,
    ) { }

    @UseGuards(RoleGuard)
    @Roles(ADMIN)
    @ApiOperation({ summary: 'Создай роль' })
    @ApiResponse({ status: 200, type: Role })
    @Post('/')
    async createRole(@Body() dto: CreateRoleDTO) {
        return await this.roleService.create(dto);
    }

    @UseGuards(RoleGuard)
    @Roles(ADMIN)
    @ApiOperation({ summary: 'Получи все роли' })
    @ApiResponse({ status: 200, type: [Role] })
    @Get('/')
    async getAllRoles() {
        return await this.roleService.findAll();
    }

}
