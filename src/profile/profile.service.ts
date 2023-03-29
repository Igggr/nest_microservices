import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile-entity';


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
