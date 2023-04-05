import { IntersectionType, OmitType, PickType } from "@nestjs/swagger";
import { User } from "src/user/entities/user-entity";
import { Profile } from "src/profile/entities/profile-entity";

export class RegisterDTO extends IntersectionType(
    OmitType(User, ['id', 'profile', 'userRoles', 'creatures']),
    OmitType(Profile, ['id', 'user'])
) { };



export class CreateUserDTO extends PickType(
    User,
    ['login', 'email', 'password']
) { };
