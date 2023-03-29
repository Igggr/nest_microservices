import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";
import { Group } from "./group-entity";
import { TextBlock } from "./text-block-entity";
import { IsInt, IsPositive } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";


@Entity()
export class BlockGroup {
    @IsInt()
    @IsPositive()
    @ApiProperty({ description: 'Primary Key', example: 1 })
    @PrimaryColumn()
    id: number;

    @Column({ type: Number })
    groupId: number;

    @Column({ type: Number })
    textBlockId: number;

    @ManyToOne(
        () => TextBlock,
        (block) => block.blockGroups,
        {
            eager: true,
            onDelete: 'CASCADE',
            cascade: true,
        }
    )
    textBlock: TextBlock;

    @ManyToOne(
        () => Group,
        (group) => group.blockGroups,
        {
            onDelete: 'CASCADE',
            cascade: true,
        }
    )
    group: Group;
}