import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDTO } from './dtos/login-dto';
import { RegisterDTO } from './dtos/register-dto';

class Token {
    @ApiProperty({
        description: 'Jwt-токен',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IlZhbkBtYWlsLmNvbSIsImlkIjoxLCJyb2xlcyI6WyJVU0VSIiwiQURNSU4iXSwiaWF0IjoxNjgwMjY0MzI1LCJleHAiOjE2ODAzNTA3MjV9.i8AScsAy3CC0KzfAKV-GF5hiQwBgftHjx8lGxWmCy7w'
    })
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
