import { PickType } from "@nestjs/mapped-types";
import { PostModel } from "../entities/post.entity";
import { IsOptional, IsString } from "class-validator";

export class CreatePostDto extends PickType(PostModel, ['postTitle', 'content', 'postType', 'isAnonymous']) {
    @IsString()
    @IsOptional()
    image?: string;

    @IsString()
    @IsOptional()
    file?: string;   
}