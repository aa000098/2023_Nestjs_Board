import { PickType } from "@nestjs/mapped-types";
import { SpaceRoleModel } from "../entities/space-role.entity";

export class CreateSpaceRoleDto extends PickType(SpaceRoleModel, ['spaceId', 'role', 'isAdministrator']) {}