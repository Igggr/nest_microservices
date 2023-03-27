import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user-entity';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { Role } from 'src/roles/entities/role-entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Role]),
    ],
    providers: [UserService],
    exports: [UserService],
    controllers: [UserController],
})
export class UserModule {}
