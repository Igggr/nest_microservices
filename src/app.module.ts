import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ProfileModule } from './profile/profile.module';
import { Profile } from './profile/entities/profile-entity';
import { User } from './user/entities/user-entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import * as Joi from 'joi';
import { Role } from './roles/entities/role-entity';
import { JwtMiddleware } from './auth/jwt/jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { FileModule } from './file/file.module';
import { TextBlockModule } from './text-block/text-block.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        APP_PORT: Joi.number().required(),
        JWT_SECRET: Joi.string().required(),
      })
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [
        User,
        Profile,
        Role,
      ],
      autoLoadEntities: true,
      synchronize: true,  // автоматические миграции
    }),
    UserModule,
    ProfileModule,
    AuthModule.forRoot(process.env.JWT_SECRET),
    RolesModule,
    FileModule,
    TextBlockModule,  // надо как-то передать в модуль secret. process.env.JWT_SECRET в модуле не видело :(
  ],
  controllers: [],
  providers: [JwtService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
