import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user-entity';
import { Equal, Repository } from 'typeorm';
import { CreateRoleDTO } from './dtos/create-role-dto';
import { Role } from './entities/role-entity';
import { UserRole } from './entities/user-role-entity';
import { USER } from './roles';
export { USER, ADMIN } from './roles';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role)
        private readonly roleRepository: Repository<Role>,
        @InjectRepository(UserRole)
        private readonly userRoleRepository: Repository<UserRole>,
    ) { }
    
    async create(dto: CreateRoleDTO) {
        const role = this.roleRepository.create(dto);
        await this.roleRepository.save(role);
    }

    async findAll() {
        return await this.roleRepository.find();
    }

    async ensureHasRoleForSimpleUser() {
        let userRole = await this.roleRepository.findOne({ where: { value: Equal(USER) } });
        if (userRole) {
            return userRole;
        }
        userRole = this.roleRepository.create({ value: USER, description: 'Пользователь' });
        return await this.roleRepository.save(userRole);
    }

    // создай, но НЕ сохраняй
    assignRoleToUser(user: User, role: Role, grantedBy?: User) {

        const userRole = this.userRoleRepository.create();
        userRole.role = role;
        userRole.user = user;

        if (grantedBy) {
            userRole.grantedBy = grantedBy;
        }
        return userRole;
    }
}
