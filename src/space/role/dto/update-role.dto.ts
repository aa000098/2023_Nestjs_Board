import { PartialType } from "@nestjs/mapped-types";
import { CreateRoleDto } from "./create-role.dto";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateRoleDto extends PartialType(CreateRoleDto) {
    @IsOptional()
    @IsString()
    role?: string;

    @IsOptional()
    @IsBoolean()
    isAdministrator?: boolean;
}