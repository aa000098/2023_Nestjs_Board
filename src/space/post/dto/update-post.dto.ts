import { PartialType } from "@nestjs/mapped-types";
import { CreatePostDto } from "./create-post.dto";
import { IsOptional } from "class-validator";
import { PostStateEnum } from "../const/post-state.const";

export class UpdatePostDto extends PartialType(CreatePostDto) {
    @IsOptional()
    postTitle?: string;

    @IsOptional()
    content?: string;

    @IsOptional()
    image?: string;

    @IsOptional()
    file?: string;

    @IsOptional()
    isAnonymous?: Boolean;
}