import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { User } from './entities/user-entity';
import { UpdateUserDTO } from './dtos.ts/update-user-dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly dataSource: DataSource,
    ) { }
    
    async hasUserWithEmail(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return user !== null;
    }
    
    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: Equal(email) } });        
        return user;
    }
    
    async findById(id: number): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id: Equal(id) } });
        return user;
    }
    
    async findAll() {
        return await this.userRepository.find();
    }

    // создай. но НЕ СОХРАНЯЙ
    async create(login: string, email: string, password: string) {
        const user = this.userRepository.create({ login, email });
        await user.setPassword(password);
        return user;
    }

    async update(id: number, dto: UpdateUserDTO) {
        const user = await this.findById(id);
        if (!user) {
            throw new HttpException(`Пользователя с id = ${id} не существует`, HttpStatus.BAD_REQUEST);
        }

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            user.email = dto.email ?? user.email;
            user.login = dto.login ?? user.login;
            if (dto.password) {
                user.setPassword(dto.password);
            }
            if (dto.name || dto.surname || dto.phone) {
                const profile = user.profile;
                profile.name = dto.name ?? profile.name;
                profile.surname = dto.surname ?? profile.surname;
                profile.phone = dto.phone ?? profile.phone;
                await queryRunner.manager.save(profile);
            }
            const updatedUser = await queryRunner.manager.save(user);
            await queryRunner.commitTransaction();

            return updatedUser;
        } catch (e) {
            await queryRunner.rollbackTransaction();
            throw new HttpException('Не удалось обновить профиль пользователя', HttpStatus.AMBIGUOUS);
        } finally {
            await queryRunner.release();
        }
    
    }

    async delete(id: number) {
        const res = await this.userRepository.delete(id);
        return res;
    }

    async getRoles(user: User): Promise<string[]> {
        const userRoles = (await this.userRepository.findOne(
            {
                where: { id: Equal(user.id) },
                relations: { userRoles: true } // нужен еще один запрос в БДб чтобы добраться до ролей
            })
        ).userRoles;
        const roles = userRoles?.map((ur) => ur.role.value) ?? [];
        return roles;
    }
}
