import { PickType } from "@nestjs/mapped-types";
import { PostModel } from "../entities/post.entity";

export class CreatePostDto extends PickType(PostModel, ['postTitle', 'postState', 'content', 'image', 'file', 'isAnonymous']) {}