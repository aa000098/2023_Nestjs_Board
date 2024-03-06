import { PickType } from "@nestjs/mapped-types";
import { SpaceModel } from "../entities/space.entity";
import { CreateRoleDto } from "../role/dto/create-role.dto";

export class CreateSpaceDto extends PickType(SpaceModel, ['spaceName', 'spaceLogo']) {
    roles: CreateRoleDto[]
}