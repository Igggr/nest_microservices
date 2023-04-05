import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entities/profile-entity';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { AuthModule } from 'src/auth/auth.module';
import { RolesModule } from 'src/roles/roles.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([Profile]),
        AuthModule.forRoot(process.env.JWT_SECRET || 'do_not_store_secret_in_git'),
        RolesModule,
    ],
    providers: [ProfileService],
    exports: [ProfileService],
    controllers: [ProfileController],
})
export class ProfileModule {}
