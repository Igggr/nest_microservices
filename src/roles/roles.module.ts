import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role-entity';
import { User } from 'src/user/entities/user-entity';
import { UserRole } from './entities/user-role-entity';
import { UserModule } from 'src/user/user.module';

@Module({
  providers: [RolesService],
  controllers: [RolesController],
  imports: [
    TypeOrmModule.forFeature([Role, User, UserRole]),
    UserModule,
  ],
  exports: [
    RolesService,
  ]
})
export class RolesModule {}
