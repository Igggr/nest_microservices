import { OmitType } from "@nestjs/swagger";
import { Role } from '../entities/role-entity';


export class CreateRoleDTO extends OmitType(Role, ['id']) {}