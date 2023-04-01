import { Body, Controller, Get, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { CreateRoleDTO } from './dtos/create-role-dto';
import { Role } from './entities/role-entity';
import { RoleGuard } from 'src/auth/guards/role-guard/role.guard';
import { Roles } from 'src/auth/guards/role-guard/role-checker';
import { BearerAuth } from 'src/docs';
import { ADMIN } from './roles';
import { PromoteUserDTO } from './dtos/promote-user.dto';


@ApiTags('Роли')
@Controller('roles')
export class RolesController {
    constructor(
        private readonly roleService: RolesService,
    ) { }

    @UseGuards(RoleGuard)
    @Roles(ADMIN.value)
    @ApiBearerAuth(BearerAuth)
    @ApiOperation({ summary: 'Создай роль' })
    @ApiResponse({ status: 200, type: Role })
    @Post('/')
    async createRole(@Body() dto: CreateRoleDTO) {
        return await this.roleService.create(dto);
    }

    @UseGuards(RoleGuard)
    @Roles(ADMIN.value)
    @ApiBearerAuth(BearerAuth)
    @ApiOperation({ summary: 'Получи все роли' })
    @ApiResponse({ status: 200, type: [Role] })
    @Get('/')
    async getAllRoles() {
        return await this.roleService.findAll();
    }

    @UseGuards(RoleGuard)
    @Roles(ADMIN.value)
    @ApiBearerAuth(BearerAuth)
    @ApiParam({
        name: 'id',
        required: true,
        description: 'id пользователя. Он должен существовать в БД',
        type: Number
        
    })
    @ApiOperation({ summary: 'Присвой пользователю роль' })
    @ApiResponse({ status: 200, type: [Role] })
    @Post('/promote/:id')
    promote(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: PromoteUserDTO,
        @Req() req
    ) {
        return this.roleService.promoteUser(id, dto.value, req.user.id);
    }

}
