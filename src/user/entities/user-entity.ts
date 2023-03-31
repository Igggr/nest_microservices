import { Profile } from "src/profile/entities/profile-entity";
import { Column, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { ApiProperty } from "@nestjs/swagger";
import { UserRole } from "src/roles/entities/user-role-entity";
import { Length, IsEmail, IsString, IsInt, IsPositive } from 'class-validator';
import { Exclude, instanceToPlain, Type } from "class-transformer";


@Entity()
export class User {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @ApiProperty({description: 'Primary key', example: 1})
    @PrimaryGeneratedColumn()
    id: Number;

    @Type(() => String)
    @IsString()
    @Length(3, 20)
    @ApiProperty({ description: "login", example: 'John43' })
    @Column({ type: String })
    login: string;

    @Type(() => String)
    @IsEmail()
    @ApiProperty({description: 'email', example: 'johndoe@mail.com'})
    @Column({ type: String })
    email: string;

    @Type(() => String)
    @IsString()
    @Length(6, 60)
    @ApiProperty({
        description: 'пароль',
        example: '123qwerty',
        writeOnly: true, // содержится в запросах, но не в ответах
    })
    @Exclude()
    @Column({ type: String })
    password: string;

    @OneToOne(
        () => Profile,
        (profile) => profile.user,
        { eager: true }
    )
    profile: Profile;

    @OneToMany(
        () => UserRole,
        (userRole) => userRole.user,
        { eager: true }
    )
    userRoles: UserRole[];  // какие у него самого роли?

    @OneToMany(
        () => UserRole,
        (userRole) => userRole.grantedBy,
    )
    creatures: UserRole[];  // кому это он банхамер доверил?


    // вместе с @Exclude на колнке пароля достаточно, чтобы не возвращать пароли в ответе
    toJSON() { return instanceToPlain(this); }

    async setPassword(password: string, hash: number = 10) {
        this.password = await bcrypt.hash(password, hash);
    }

    async checkPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
} 