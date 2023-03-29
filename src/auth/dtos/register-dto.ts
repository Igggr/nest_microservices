import { IntersectionType, OmitType } from "@nestjs/swagger";
import { User } from "src/user/entities/user-entity";
import { Profile } from "src/profile/entities/profile-entity";

export class RegisterDTO extends IntersectionType(
    OmitType(User, ['id', 'profile']),
    OmitType(Profile, ['id', 'user'])
) { };
