import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Equal, Repository } from 'typeorm';
import { Profile } from './entities/profile-entity';
import { RegisterDTO } from 'src/auth/dtos/register-dto';
import { AuthService } from 'src/auth/auth.service';
import { RolesService } from 'src/roles/roles.service';
import { USER } from 'src/roles/roles';


@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        private readonly authService: AuthService,
        private readonly dataSource: DataSource,
        private readonly roleService: RolesService,
    ) { }

    // создайб но НЕ СОХРАНЯЙ
    async createProfile(name: string, surname: string, phone: string, userId: number) {
        const profile = await this.profileRepository.create({ name, surname, phone, userId });
        return profile;
    }

    async register(dto: RegisterDTO) {
    
        // вобщем-то целостность данных похерена - 
        // если сбой произойдет на этапе записи Profile / UserRole - то
        // откатятся только они, а User - нет 
        // Но для микросервисов так надо
        const userId = await this.authService.registerUser(dto);

        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            const simpleUserRole = await this.roleService.ensureHasRole(USER);

            const userRole = await this.roleService.assignRoleToUser(userId, simpleUserRole)
            const profile = await this.createProfile(dto.name, dto.surname, dto.phone, userId);

            await queryRunner.manager.save(userRole);
            await queryRunner.manager.save(profile);

            // транзакция удалась
            await queryRunner.commitTransaction();
            return profile;
        } catch (e) {
            await queryRunner.rollbackTransaction(); // откати
            throw new HttpException('Что-то пошло не так', HttpStatus.INTERNAL_SERVER_ERROR);
        } finally {
            await queryRunner.release();
        }


    }

    async finById(id: number): Promise<Profile> {
        const profile = await this.profileRepository.findOne({
            where: {
                id: Equal(id)
            }
        });
        if (!profile) {
            throw new HttpException(`Профилия с id = ${id} не суещствует`, HttpStatus.NOT_FOUND);
        }
        return profile;
    }

    async getAll(): Promise<Profile[]> {
        return this.profileRepository.find();
    }
}
