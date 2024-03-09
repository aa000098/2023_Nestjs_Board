import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UserModel } from 'src/user/entities/user.entity';
import { User } from 'src/user/decorator/user.decorator';
import { IsPublic } from 'src/common/decorator/is-public.decorator';
import { RoleEnum } from './role/const/role.const';
import { Authority } from './role/decorator/authority.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get()
  @IsPublic()
  getSpaces() {
    return this.spaceService.getAllSpaces();
  }

  @Post()
  postSpace(
    @User() user: UserModel, 
    @Body() body: CreateSpaceDto,
  ) {
    return this.spaceService.createSpace(user.id, body);
  }

  @Post(':spaceId/join')
  joinSpace(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
    @Body('entryCode') entryCode: string,
  ) {
    return this.spaceService.addUserToSpace(spaceId, user.id, entryCode);
  }

  @Delete(':spaceId/withdraw')
  withdrawSpace(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
  ) {
    return this.spaceService.deleteUserFromSpace(spaceId, user.id);
  }

  @Delete(':spaceId')
  @Authority(RoleEnum.OWNER)
  deleteSpace(
    @Param('spaceId', ParseIntPipe) spaceId: number,
  ) {
    return this.spaceService.deleteSpace(spaceId);
  }
}
