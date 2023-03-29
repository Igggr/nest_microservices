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
    private createGroup(title: string): Group {
        const group = this.groupRepository.create({ title });
        return group;
    }

    async ensureGroup(title: string): Promise<Group> {
        const group = await this.groupRepository.findOne({
            where: { title: Equal(title) }
        });
        if (group) {
            return group;
        } else {
            return this.createGroup(title);
        }
    }

}
