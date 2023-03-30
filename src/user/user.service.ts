import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, Repository } from 'typeorm';
import { User } from './entities/user-entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }
    
    async hasUserWithEmail(email: string): Promise<boolean> {
        const user = await this.findByEmail(email);
        return user !== null;
    }
    
    async findByEmail(email: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { email: Equal(email) } });        
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
