import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { User } from 'src/user/decorator/user.decorator';
import { UserModel } from 'src/user/entities/user.entity';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { RoleEnum } from 'src/space/role/const/role.const';
import { Authority } from 'src/space/role/decorator/authority.decorator';

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
  @Authority(RoleEnum.OWNER, RoleEnum.ADMIN)
  postChat(
    @User() user: UserModel,
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: CreateChatDto,
  ) {
    return this.chatService.createChat(postId, user.id, body);
  }

  @Patch(':id')
  @Authority(RoleEnum.OWNER, RoleEnum.ADMIN)
  patchChat(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserModel,
    @Body() body: UpdateChatDto,
  ) {
    return this.chatService.updateChat(id, body);
  }

  @Delete(':id')
  @Authority(RoleEnum.OWNER, RoleEnum.ADMIN)
  deleteChat(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.chatService.deleteChat(id);
  }
}
