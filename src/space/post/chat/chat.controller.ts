import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from 'src/user/decorator/user.decorator';
import { UserModel } from 'src/user/entities/user.entity';
import { IsChatMineOrAdmin } from './guard/is-chat-mine-or-admin.guard';
import { CheckChatConstraint } from './guard/check-chat-constraint.guard';

@Controller('space/:spaceId/post/:postId/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get()
  getChats(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: UserModel,
  ) {
    return this.chatService.getAllChats(spaceId, postId, user.id);
  }

  @Get(':chatId')
  getChat(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('chatId', ParseIntPipe) chatId: number,
    @User() user: UserModel,
  ) {
    return this.chatService.getChatById(spaceId, chatId, user.id);
  }

  @Post()
  @UseGuards(CheckChatConstraint)
  postChat(
    @User() user: UserModel,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateChatDto,
  ) {
    return this.chatService.createChat(postId, user.id, body);
  }

  @Patch(':chatId')
  @UseGuards(IsChatMineOrAdmin)
  patchChat(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Body() body: UpdateChatDto,
  ) {
    return this.chatService.updateChat(chatId, body);
  }

  @Delete(':chatId')
  @UseGuards(IsChatMineOrAdmin)
  deleteChat(
    @Param('chatId', ParseIntPipe) chatId: number,
  ) {
    return this.chatService.deleteChat(chatId);
  }
}
