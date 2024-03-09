import { PickType } from "@nestjs/mapped-types";
import { ChatModel } from "../entities/chat.entity";

export class CreateChatDto extends PickType(ChatModel, ['content', 'parentId', 'isAnonymous']) {}