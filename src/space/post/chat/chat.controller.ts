import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from 'src/user/decorator/user.decorator';
import { UserModel } from 'src/user/entities/user.entity';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { IsChatMineOrAdmin } from './guard/is-chat-mine-or-admin.guard';
import { CheckChatConstraint } from './guard/check-chat-constraint.guard';

@Controller('space/:spaceId/post/:postId/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) { }

  @Get()
  @IsPublic()
  getChats(
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.chatService.getAllChats(postId);
  }

  @Get(':id')
  @IsPublic()
  getChat(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.chatService.getChatById(id);
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

  @Patch(':id')
  @UseGuards(IsChatMineOrAdmin)
  patchChat(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateChatDto,
  ) {
    return this.chatService.updateChat(id, body);
  }

  @Delete(':id')
  @UseGuards(IsChatMineOrAdmin)
  deleteChat(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.chatService.deleteChat(id);
  }
}
