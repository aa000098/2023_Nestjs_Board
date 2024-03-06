import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UserModel } from 'src/user/entities/user.entity';
import { AccessTokenGuard } from 'src/auth/guard/bearer_token.guard';
import { User } from 'src/user/decorator/user.decorator';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getSpaces() {
    return this.spaceService.getAllSpaces();
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  postSpace(
    @User() user: UserModel, 
    @Body() body: CreateSpaceDto,
  ) {
    return this.spaceService.createSpace(user.id, body);
  }

  @Post(':spaceId/join')
  @UseGuards(AccessTokenGuard)
  joinSpace(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
    @Body('entryCode') entryCode: string,
  ) {
    return this.spaceService.addUserToSpace(spaceId, user.id, entryCode);
  }

  @Delete(':spaceId/withdraw')
  @UseGuards(AccessTokenGuard)
  withdrawSpace(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
  ) {
    return this.spaceService.deleteUserFromSpace(spaceId, user.id);
  }

  @Delete(':spaceId')
  @UseGuards(AccessTokenGuard)
  deleteSpace(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel
  ) {
    return this.spaceService.deleteSpace(spaceId, user.id);
  }
}
