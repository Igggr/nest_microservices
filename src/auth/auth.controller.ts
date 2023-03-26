import { Body, Controller, Post, Get } from '@nestjs/common';
import { ProfileService } from 'src/profile/profile.service';
import { RegisterDTO } from './dtos/register-dto';

@Controller('auth')
export class AuthController {
    constructor(
        private readonly profile: ProfileService,
    ) {}

    @Post('/register')
    async register(@Body() registerDTO: RegisterDTO) {
        return await this.profile.register(registerDTO);
    }

}
