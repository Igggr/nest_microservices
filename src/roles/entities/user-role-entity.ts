import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { User } from "src/user/entities/user-entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role-entity";

@Entity()
export class UserRole {
    @Type(() => Number)
    @ApiProperty({ description: 'Primary key', example: 1 })
    @PrimaryGeneratedColumn()
    id: Number;

    @Type(() => Number)
    @Column({ type: Number })
    roleId: number;

    @Type(() => Number)
    @Column({ type: Number })
    userId: number;

    @ManyToOne(
        () => User,
        (user) => user.userRoles,
        {
            cascade: true,
            onDelete: 'CASCADE',
        }
    )
    user: User;

    @ManyToOne(
        () => Role,
        (role) => role.userRoles,
        {
            eager: true,
            cascade: true,
            onDelete: 'CASCADE',
        }
    )
    role: Role;

    @Type(() => Date)
    @CreateDateColumn({ type: "timestamp", default: () => "CURRENT_TIMESTAMP(6)" })
    grantedAt: Date;


    @ManyToOne(
        () => User,
        (user) => user.creatures,
        {
            cascade: true,
            onDelete: 'CASCADE',
         }
    )
    grantedBy: User;  // кто доверил ему банхамер?
} 