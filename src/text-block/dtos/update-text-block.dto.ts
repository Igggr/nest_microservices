import { OmitType, IntersectionType, PickType, PartialType, } from "@nestjs/swagger";
import { Group } from "../entities/group-entity";
import { TextBlock } from "../entities/text-block-entity";

export class UpdateTextBlockDTO extends PartialType(
    IntersectionType(
        OmitType(TextBlock, ['id', 'group', 'image']),
        PickType(Group, ['groupName']),
    )
) { }