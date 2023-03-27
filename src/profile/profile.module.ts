import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entitties/profile-entities';
import { ProfileService } from './profile.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile]),
    ],
    providers: [ProfileService],
    exports: [ProfileService],
})
export class ProfileModule {}
