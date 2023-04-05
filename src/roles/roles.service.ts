import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user-entity';
import { Equal, Repository } from 'typeorm';
import { CreateRoleDTO } from './dtos/create-role-dto';
import { Role } from './entities/role-entity';
import { UserRole } from './entities/user-role-entity';
import { USER, ADMIN } from './roles';
import { UserService } from 'src/user/user.service';
import { number } from 'joi';


@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
        private readonly userService: UserService,
    ) { }
    
    async create(dto: CreateRoleDTO) {
        const role = await this.findRoleByValue(dto.value);
        if (role) {
            throw new HttpException(`Роль c value = ${role.value} уже существует`, HttpStatus.CONFLICT)
        }
        const newRole = this.roleRepository.create(dto);
        return await this.roleRepository.save(newRole);
    }

    async findAll() {
        return await this.roleRepository.find();
    }

    async findRoleByValue(value: string): Promise<Role> {
        const role = await this.roleRepository.findOne({
            where: {
                value: Equal(value),
            }
        })
        return role;
    }

    async ensureHasRole(role = USER) {
        let userRole = await this.findRoleByValue(role.value);
        if (userRole) {
            return userRole;
        }
        userRole = this.roleRepository.create(role);
        return await this.roleRepository.save(userRole);
    }

    // создай, но НЕ сохраняй
    async assignRoleToUser(userId: number, role: Role, grantedBy?: User) {

        const userRole = this.userRoleRepository.create({ userId, role });

        if (grantedBy) {
            userRole.grantedBy = grantedBy;
        }

        await this.userRoleRepository.save(userRole);
        return userRole;
    }

    async promoteUser(userId: number, roleName: string, promotedBy: number): Promise<UserRole> {
        const role = await this.findRoleByValue(roleName);
        if (!role) {
            throw new HttpException(`Роли с value=${roleName} не существует, сначала создайте ее`, HttpStatus.BAD_REQUEST)
        }
        const user = await this.userService.findById(userId);
        if (!user) {
            throw new HttpException(`Пользователя с id=${userId} не существует`, HttpStatus.BAD_REQUEST)
        }
        const grantedBy = await this.userService.findById(promotedBy);
        return this.assignRoleToUser(userId, role, grantedBy);
    }

    async delete(id: number) {
        const role = await this.roleRepository.findOne({
            where: { id: Equal(id) }
        });
        if (role) {
            return await this.roleRepository.remove(role);
        }
        return 'Роль не найдена';
    }
}
