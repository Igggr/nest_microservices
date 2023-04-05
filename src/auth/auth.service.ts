import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from "@nestjs/jwt";
import { ProfileService } from 'src/profile/profile.service';
import { RolesService } from 'src/roles/roles.service';
import { User } from 'src/user/entities/user-entity';
import { UserService } from 'src/user/user.service';
import { DataSource } from 'typeorm';
import { LoginDTO } from './dtos/login-dto';
import { RegisterDTO, CreateUserDTO } from './dtos/register-dto';
import { USER, ADMIN } from '../roles/roles'
import { Token } from './dtos/token-dto';


@Injectable()
export class AuthService {
    constructor(
        private readonly jwt: JwtService,
        private readonly userService: UserService,
    ) { }

    async login(dto: LoginDTO): Promise<Token> {
        const user = await this.validateUser(dto);
        return this.generateToken(user);
    }

    async registerUser(dto: CreateUserDTO) {
        if (await this.userService.hasUserWithEmail(dto.email)) {
            throw new HttpException(`User with email ${dto.email} already exist`, HttpStatus.NOT_ACCEPTABLE);
        }
        const user = await this.userService.createAndSave(dto);
        return user.id;
    }

    private async generateToken(user: User) {
        const roles = await this.userService.getRoles(user);
        const payload = { email: user.email, id: user.id, roles };
        const token = this.jwt.sign(payload);
        return { token };
    }

    private async validateUser(dto: LoginDTO) {
        const user = await this.userService.findByEmail(dto.email);
        if (user && await user.checkPassword(dto.password)) {
            return user;
        }
        throw new UnauthorizedException({ message: 'Некорректный емайл или пароль' });
    }

}
