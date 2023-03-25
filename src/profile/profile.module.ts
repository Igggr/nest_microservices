import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Profile } from './entitties/profile-entities';

@Module({
    imports: [
        TypeOrmModule.forFeature([Profile]),
    ]
})
export class ProfileModule {}
