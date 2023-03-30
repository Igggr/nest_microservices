import { PickType, IntersectionType } from "@nestjs/swagger";
import { Group } from "../entities/group-entity";
import { TextBlock } from "../entities/text-block-entity";

export class CreateTextBlockDTO extends IntersectionType(
    PickType(TextBlock, ['title', 'text']),
    PickType(Group, ['groupName']),
) {}
