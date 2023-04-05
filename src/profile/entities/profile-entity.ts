import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/entities/user-entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsPositive, IsInt, IsString, Length, IsMobilePhone } from 'class-validator';
import { Type } from "class-transformer";

@Entity()
export class Profile {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @ApiProperty({description: "Primary Key", example: 1})
    @PrimaryGeneratedColumn()
    id: Number;

    @Type(() => String)
    @Length(3, 30)
    @IsString()
    @ApiProperty({description: 'Имя пользователя', example: 'John'})
    @Column({ type: String })
    name: string;

    @Type(() => String)
    @Length(3, 30)
    @IsString()
    @ApiProperty({ description: 'Фамилия пользователя', example: 'Doe' })
    @Column({ type: String })
    surname: string;

    @Type(() => String)
    @IsMobilePhone('ru-RU')
    @ApiProperty({description: 'Телефон пользователя', example: '+79510032345'})
    @Column({ type: String })
    phone: string;

    @Type(() => Number)
    @Column({ type: Number })
    userId: number;
    
    @JoinColumn() 
    @OneToOne(
        () => User,
        (user) => user.profile,
        {
            cascade: true,
            onDelete: 'CASCADE'
        }
    )
    user: User;
} 