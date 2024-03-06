import { PickType } from "@nestjs/mapped-types";
import { RoleModel } from "../entities/role.entity";

export class CreateRoleDto extends PickType(RoleModel, ['roleName', 'isAdministrator', 'isOwner']) {}