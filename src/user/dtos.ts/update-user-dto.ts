import { PartialType } from "@nestjs/swagger";
import { RegisterDTO } from "src/auth/dtos/register-dto";

export class UpdateUserDTO extends PartialType(RegisterDTO) { };