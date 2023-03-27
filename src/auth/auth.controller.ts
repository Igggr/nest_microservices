import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileService } from 'src/profile/profile.service';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login-dto';
import { RegisterDTO } from './dtos/register-dto';

class Token {
    token: string;
};

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @ApiOperation({summary: "Создает пользователя"}) // для чего нужен
    @ApiResponse({status: 200, type: Token})
    @Post('/register')
    async register(@Body() dto: RegisterDTO) {
        return await this.authService.register(dto);
    }

    @ApiOperation({ summary: "Возвращает jwt-токен" }) // для чего нужен
    @ApiResponse({ status: 200, type: Token })
    @Post('/login')  // swagger не умеет в GET с body (потому что раньше стандарт запрещал это)
    async login(@Body() dto: LoginDTO) {
        return this.authService.login(dto);
    }

}
