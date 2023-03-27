import { Body, Controller, Post, Get } from '@nestjs/common';
import { ProfileService } from 'src/profile/profile.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login-dto';
import { RegisterDTO } from './dtos/register-dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly profile: ProfileService,
        private readonly authService: AuthService,
    ) {}

    @Post('/register')
    async register(@Body() registerDTO: RegisterDTO) {
        return await this.profile.register(registerDTO);
    }

    @Get('/login')
    async login(@Body() dto: LoginDTO) {
        return this.authService.login(dto);
    }

}
