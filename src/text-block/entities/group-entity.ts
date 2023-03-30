import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsInt, IsPositive, IsString, Length } from 'class-validator';
import { TextBlock } from "./text-block-entity";


@Entity()
export class Group {
    @IsInt()
    @IsPositive()
    @ApiProperty({ description: 'Primary Key', example: 1 })
    @PrimaryGeneratedColumn()
    id: number;

    @IsString()
    @Length(3, 20)
    @ApiProperty({ description: 'Название группы текстовых блоков', example: 'main-page' })
    @Column()
    groupName: string;

    @OneToMany(
        () => TextBlock,
        (block) => block.group,
        {
            eager: true,
        }
    )
    blocks: TextBlock[];
}
