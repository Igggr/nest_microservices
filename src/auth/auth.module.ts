import { Module } from '@nestjs/common';
import { ProfileModule } from 'src/profile/profile.module';
import { AuthController } from './auth.controller';

@Module({
  controllers: [AuthController],
  imports: [
    ProfileModule,
  ]
})
export class AuthModule {}
