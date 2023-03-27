import { Profile } from "src/profile/entitties/profile-entities";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { ApiProperty } from "@nestjs/swagger";
import { Role } from "src/roles/entities/role-entity";
import { UserRole } from "src/roles/entities/user-roles";

@Entity()
export class User {
    @ApiProperty({description: 'Primary key', example: 1})
    @PrimaryGeneratedColumn()
    id: Number;

    @ApiProperty({ description: "login", example: 'John43' })
    @Column({ type: String })
    login: string;

    @ApiProperty({description: 'email', example: 'johndoe@mail.com'})
    @Column({ type: String })
    email: string;

    @ApiProperty({description: 'пароль', example: '123qwerty'})
    @Column({ type: String })
    password: string;

    @OneToOne(
        () => Profile,
        (profile) => profile.user,
    )
    profile: Profile;

    @OneToMany(
        () => UserRole,
        (userRole) => userRole.user,
        { cascade: true }
    )
    userRoles: Role[];

    @OneToMany(
        () => UserRole,
        (userRole) => userRole.grantedBy,
    )
    creatures: UserRole[];  // кому это он банхамер доверил?     

    async setPassword(password: string, hash: number = 10) {
        this.password = await bcrypt.hash(password, hash);
    }

    async checkPassword(password: string): Promise<boolean> {
        return await bcrypt.compare(password, this.password);
    }
} 