import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsInt, IsPositive, IsString, Length } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";
import { BlockGroup } from "./block-group-entity";

@Entity()
export class TextBlock {
    @IsInt()
    @IsPositive()
    @ApiProperty({description: 'Primary Key', example: 1})
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @Length(3, 30)
    @ApiProperty({description: "Заголовок", example: 'Неведомая фигня'})
    @Column()
    title: string;

    @IsString()
    @Length(20, 300)
    @ApiProperty({
        description: 'Подробное описание',
        example: 'Только сейчас. Скидка! Проверенный продавец. Гарантия 2 недели. Плошка риса в подарок!'
    })
    @Column()
    text: string;

    @ApiProperty({ description: '', example: 'preview.png'})
    @Column()
    image: string;


    @OneToMany(
        () => BlockGroup,
        (blockgroup) => blockgroup.block,
    )
    blockGroups: BlockGroup[] 

}