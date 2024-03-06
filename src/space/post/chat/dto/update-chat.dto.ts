import { PartialType } from "@nestjs/mapped-types";
import { CreateChatDto } from "./create-chat.dto";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class UpdateChatDto extends PartialType(CreateChatDto) {
    @IsNumber()
    @IsOptional()
    content?: string;

    @IsBoolean()
    @IsOptional()
    isAnonymous?: Boolean;
}