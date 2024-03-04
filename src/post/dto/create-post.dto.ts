import { PickType } from "@nestjs/mapped-types";
import { PostModel } from "../entities/post.entity";

export class CreatePostDto extends PickType(PostModel, ['spaceId', 'writerId', 'postTitle', 'postState', 'content', 'image', 'file', 'isAnonymous']) {}