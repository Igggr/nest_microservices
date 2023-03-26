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
        private readonly userService: UserService,
        private readonly connection: Connection,  // транзакции
    ) { }
    
    // почему это в моделе профайла? Считаю. что должно быть в модуле User.
    // Модуль юзер хранит почту и пароль - все штуки связанные с регистрацией / авторизацией должны быть в нем
    // Однако задание зачем-то предписывает писать регистрацию здесь
    async register(dto: RegisterDTO) {
        if (await this.userService.hasUserWithEmail(dto.email)) {
            throw new HttpException(`User with email ${dto.email} already exist`, HttpStatus.NOT_ACCEPTABLE);
        }

        // нет смысла создать пользователя без профайла - исолзуем транзакцию,
        // чтобы либо создались оба, либо не создалось ничего
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const user = await this.userService.create(dto.login, dto.email, dto.password);
            await queryRunner.manager.save(user);
    
            const profile = this.profileRepository.create({ name: dto.name, surname: dto.surname, phone: dto.phone });
            profile.user = user;
            await queryRunner.manager.save(profile);

            // транзакция удалась
            await queryRunner.commitTransaction();
        } catch (e) {
            await queryRunner.rollbackTransaction(); // откати
            return 'Что-то пошло не так';
        } finally {
            await queryRunner.release();
        }

        return 'Created profile';
    }
}
