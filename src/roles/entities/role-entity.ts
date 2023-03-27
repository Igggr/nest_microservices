import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/entities/user-entity";
import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { UserRole } from "./user-roles";

@Entity()
export class Role {
    @ApiProperty({ description: 'Primary key', example: 1 })
    @PrimaryGeneratedColumn()
    id: Number;

    @ApiProperty({ description: "Роль пользователя", example: 'ADMIN' })
    @Column({ type: String, unique: true, nullable: false })
    value: string;

    @ApiProperty({ description: 'Описание роли', example: 'Администратор' })
    @Column({ type: String })
    description: string;

    @OneToMany(
        () => UserRole,
        (userRole) => userRole.role,
    )
    userRoles: UserRole[];
} 