import { PickType } from "@nestjs/mapped-types";
import { SpaceModel } from "../entities/space.entity";
import { CreateRoleDto } from "../role/dto/create-role.dto";
import { IsOptional, IsString } from "class-validator";

export class CreateSpaceDto extends PickType(SpaceModel, ['spaceName']) {
    @IsString()
    @IsOptional()
    spaceLogo?: string;

    roles: CreateRoleDto[];
}