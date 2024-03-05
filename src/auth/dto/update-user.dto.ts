import { PartialType } from "@nestjs/mapped-types";
import { IsOptional, IsString } from "class-validator";
import { RegisterUserDto } from "src/auth/dto/register-user.dto";

export class UpdateUserDto extends PartialType(RegisterUserDto) {
    @IsString()
    password: string;

    @IsOptional()
    profileImage?: Buffer;
}