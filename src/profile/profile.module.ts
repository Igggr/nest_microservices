import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from 'src/user/user.module';
import { Profile } from './entitties/profile-entities';
import { ProfileService } from './profile.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile]),
        UserModule,
    ],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule {}
