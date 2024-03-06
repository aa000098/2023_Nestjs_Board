import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { AccessTokenGuard } from 'src/auth/guard/bearer_token.guard';
import { User } from 'src/user/decorator/user.decorator';
import { UserModel } from 'src/user/entities/user.entity';

@Controller('space/:spaceId/post/:postId/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getChats(
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.chatService.getAllChats(postId);
  }

  @Get(':id')
  getChat(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.chatService.getChatById(id);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  postChat(
    @User() user: UserModel,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateChatDto,
  ) {
    return this.chatService.createChat(postId, user.id, body);
  }

  @Patch(':id')
  @UseGuards(AccessTokenGuard)
  patchChat(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserModel,
    @Body() body: UpdateChatDto,
  ) {
    return this.chatService.updateChat(id, user.id, body);
  }

  @Delete(':id')
  @UseGuards(AccessTokenGuard)
  deleteChat(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserModel,
  ) {
    return this.chatService.deleteChat(id, user.id);
  }
}
