import { Optional } from "@nestjs/common";
import { OmitType, IntersectionType, PickType, } from "@nestjs/swagger";
import { Group } from "../entities/group-entity";
import { TextBlock } from "../entities/text-block-entity";

export class UpdateTextBlockDTO extends IntersectionType(
    OmitType(TextBlock, ['id', 'group']),
    PickType(Group, ['groupName']),
) { }