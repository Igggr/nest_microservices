import { PickType } from "@nestjs/swagger";
import { Role } from "../entities/role-entity";

export class PromoteUserDTO extends PickType(Role, ['value']) {}