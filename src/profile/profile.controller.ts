import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { LoginDTO } from 'src/auth/dtos/login-dto';
import { RegisterDTO } from 'src/auth/dtos/register-dto';
import { Token } from 'src/auth/dtos/token-dto';
import { ProfileService } from './profile.service';
import { Profile } from './entities/profile-entity';


@ApiTags('Профиль пользователя')
@Controller('profile')
export class ProfileController {
    constructor(
        private readonly profileService: ProfileService,
        private readonly authService: AuthService,
    ) { }

    @ApiOperation({ summary: "Создает пользователя и его профиль" }) // для чего нужен
    @ApiResponse({ status: 200, type: Profile })
    @Post('/register')
    async register(@Body() dto: RegisterDTO): Promise<Profile> {
        return this.profileService.register(dto);

    }

    @ApiOperation({ summary: "Возвращает jwt-токен" }) // для чего нужен
    @ApiResponse({ status: 200, type: Token })
    @Post('/login')  // swagger не умеет в GET с body (потому что раньше стандарт запрещал это)
    async login(@Body() dto: LoginDTO) {
        return this.authService.login(dto);
    }

    @ApiOperation({ summary: "Информация о всех профилях" }) // для чего нужен
    @ApiResponse({ status: 200, type: [Profile] })
    @Get('/')
    getAllProfiles(): Promise<Profile[]> {
        return this.profileService.getAll();
    }

    @ApiOperation({ summary: "Информация о конкретном профиле" }) // для чего нужен
    @ApiResponse({ status: 200, type: Profile })
    @Get('/:id')
    getOneProfile(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<Profile> {
        return this.profileService.finById(id)
    }
}
