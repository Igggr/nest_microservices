import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user-roles";
import { IsString, Length, IsInt, IsPositive, IsUppercase } from 'class-validator';

@Entity()
export class Role {
    @IsInt()
    @IsPositive()
    @ApiProperty({ description: 'Primary key', example: 1 })
    @PrimaryGeneratedColumn()
    id: Number;

    @IsString()
    @Length(3, 20)
    @IsUppercase()
    @ApiProperty({ description: "Роль пользователя", example: 'ADMIN' })
    @Column({ type: String, unique: true, nullable: false })
    value: string;

    @IsString()
    @Length(10, 100)
    @ApiProperty({ description: 'Описание роли', example: 'Администратор' })
    @Column({ type: String })
    description: string;

    @OneToMany(
        () => UserRole,
        (userRole) => userRole.role,
    )
    userRoles: UserRole[];
} 