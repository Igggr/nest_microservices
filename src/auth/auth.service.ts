import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { User } from 'src/user/entities/user-entity';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dtos/login-dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly userService: UserService
    ) { }

    async login(dto: LoginDTO) {
        const user = await this.validateUser(dto);
        return this.generateToken(user);
    }

    private async generateToken(user: User) {
        const payload = { email: user.email, id: user.id };
        const token = this.jwt.sign(payload);
        return { token };
    }

    private async validateUser(dto: LoginDTO) {
        const user = await this.userService.findByEmail(dto.email);
        if (user && await user.checkPassword(dto.password)) {
            return user;
        }
        throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' })
    }

}
