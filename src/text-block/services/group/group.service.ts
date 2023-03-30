import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from 'src/text-block/entities/group-entity';
import { Equal, Repository } from 'typeorm';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>,
    ) { }
    
    // Создай, но не сохраняй
    private createGroup(groupName: string): Group {
        const group = this.groupRepository.create({ groupName });
        return group;
    }

    async ensureGroup(groupName: string): Promise<Group> {
        const group = await this.groupRepository.findOne({
            where: { groupName: Equal(groupName) }
        });
        if (group) {
            return group;
        } else {
            return this.createGroup(groupName);
        }
    }

}
