import { PickType } from "@nestjs/mapped-types";
import { Group } from "../entities/group-entity";
import { TextBlock } from "../entities/text-block-entity";

export class CreateTextBlockDTO extends PickType(TextBlock, ['title', 'text']) {
    // как пересечь 2 типа с одинаковым назавнием полей, перименова одно
    // по норьмальному я не знаю. А так потеряет инфу для swagger
    groupName: Group['title'];  
}
