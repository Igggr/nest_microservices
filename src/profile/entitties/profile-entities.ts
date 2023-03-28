import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/entities/user-entity";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Profile {
    @ApiProperty({description: "Primary Key", example: 1})
    @PrimaryGeneratedColumn()
    id: Number;

    @ApiProperty({description: 'Имя пользователя', example: 'John'})
    @Column({ type: String })
    name: string;

    @ApiProperty({ description: 'Фамилия пользователя', example: 'Doe' })
    @Column({ type: String })
    surname: string;

    @ApiProperty({description: 'телефон пользователя', example: '+79510032345'})
    @Column({ type: String })
    phone: string;

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