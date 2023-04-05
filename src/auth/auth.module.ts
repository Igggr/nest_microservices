import { DynamicModule, Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ProfileModule } from 'src/profile/profile.module';
import { RolesModule } from 'src/roles/roles.module';
import { UserModule } from 'src/user/user.module';
import { AuthService } from './auth.service';


@Module({})
export class AuthModule {

  static forRoot(secret: string): DynamicModule {
    return {
      controllers: [],
      imports: [
        UserModule,
        JwtModule.register({
          secret,
          signOptions: {
            expiresIn: '24h'
          }
        })
      ],
      providers: [
        AuthService,
      ],
      exports: [
        AuthService,
      ],
      module: AuthModule
    }
  }
}