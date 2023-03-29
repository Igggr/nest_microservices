import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IsInt, IsPositive, IsString, Length } from 'class-validator';
import { BlockGroup } from "./block-group-entity";

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
    title: string;

    @OneToMany(
        () => BlockGroup,
        (blockGroup) => blockGroup.group,
        {
            eager: true,
        }
    )
    blockGroups: BlockGroup[];
}
