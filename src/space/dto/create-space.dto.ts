import { PickType } from "@nestjs/mapped-types";
import { SpaceModel } from "../entities/space.entity";
import { CreateSpaceRoleDto } from "./create-space-role.dto";

export class CreateSpaceDto extends PickType(SpaceModel, ['spaceName', 'spaceLogo']) {
    spaceRoles: CreateSpaceRoleDto[]
}