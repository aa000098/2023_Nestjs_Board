import { PickType } from "@nestjs/mapped-types";
import { ChatModel } from "../entities/chat.entity";

export class CreateChatDto extends PickType(ChatModel, ['postId', 'writerId', 'content', 'chatGroup', 'isAnonymous']) {}