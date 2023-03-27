import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Connection, Repository } from 'typeorm';
import { Profile } from './entitties/profile-entities';
import { RegisterDTO } from 'src/auth/dtos/register-dto';


@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
    ) { }

    // создайб но НЕ СОХРАНЯЙ
    async create(name: string, surname: string, phone: string) {
        const profile = await this.profileRepository.create({ name, surname, phone });
        return profile;
    }

}
