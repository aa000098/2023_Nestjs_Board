import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getChats() {
    return this.chatService.getAllChats();
  }

  @Get(':id')
  getChat(
    @Param('id') id: number,
  ) {
    return this.chatService.getChatById(id);
  }

  @Post()
  postChat(
    @Body() body: CreateChatDto,
  ) {
    return this.chatService.createChat(body);
  }

  @Patch(':id')
  patchChat(
    @Param('id') id: number,
    @Body() body: UpdateChatDto,
  ) {
    return this.chatService.updateChat(id, body);
  }

  @Delete(':id')
  deleteChat(
    @Param('id') id: number,
  ) {
    return this.chatService.deleteChat(id);
  }
}
