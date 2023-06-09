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
import { Group } from './text-block/entities/group-entity';
import { TextBlock } from './text-block/entities/text-block-entity';
import { FileRecord } from './file/entities/file-entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import * as path from 'path';


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
        Group,
        TextBlock,
      ],
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'prod',  // автоматические миграции, в prode не применять
    }),
    ServeStaticModule.forRoot({
      rootPath: path.resolve(__dirname, '..', 'static'),
    }),
    UserModule,
    ProfileModule,
    AuthModule.forRoot(process.env.JWT_SECRET), // надо как-то передать в модуль secret. process.env.JWT_SECRET в модуле не видело :(
    RolesModule,
    FileModule,
    TextBlockModule,
    FileRecord,
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
