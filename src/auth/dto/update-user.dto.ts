import { PartialType } from "@nestjs/mapped-types";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { RegisterUserDto } from "src/auth/dto/register-user.dto";
import { GendersEnum } from "src/user/const/gender.const";

export class UpdateUserDto extends PartialType(RegisterUserDto) {
    @IsString()
    @IsOptional()
    userName?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsOptional()
    profileImage?: Buffer;

    @IsOptional()
    @IsEnum(GendersEnum)
    gender?: GendersEnum;
}