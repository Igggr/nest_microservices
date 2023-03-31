import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IsInt, IsPositive, IsString, Length } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { Group } from "./group-entity";
import { Type } from "class-transformer";

@Entity()
export class TextBlock {
    @Type(() => Number)
    @IsInt()
    @IsPositive()
    @ApiProperty({description: 'Primary Key', example: 1})
    @PrimaryGeneratedColumn()
    id: number;

    @Type(() => String)
    @IsString()
    @Length(3, 30)
    @ApiProperty({description: "Заголовок", example: 'Неведомая фигня'})
    @Column()
    title: string;

    @Type(() => String)
    @IsString()
    @Length(20, 300)
    @ApiProperty({
        description: 'Подробное описание',
        example: 'Только сейчас. Скидка! Проверенный продавец. Гарантия 2 недели. Плошка риса в подарок!'
    })
    @Column()
    text: string;

    @Type(() => String)
    @ApiProperty({ description: '', example: 'preview.png'})
    @Column()
    image: string;

    @ManyToOne(
        () => Group,
        (group) => group.blocks,
        {
            eager: true,
            onDelete: 'SET NULL'
        }
    )
    group: Group;

}