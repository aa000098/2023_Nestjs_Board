import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UserModel } from 'src/user/entities/user.entity';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
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

  @Get('role/:spaceId')
  getSpaceRole(
    @Param('spaceId', ParseIntPipe) spaceId: number
  ) {
    return this.spaceService.getSpaceRole(spaceId);
  }

  @Post('join/:spaceId')
  @UseGuards(AccessTokenGuard)
  joinSpace(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
    @Body('entrycode') entryCode: string,
  ) {
    return this.spaceService.addUserToSpace(spaceId, user.id, entryCode);
  }

  @Delete('withdraw/:spaceId')
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
    @Param('spaceid', ParseIntPipe) spaceId: number,
    @User() user: UserModel
  ) {
    return this.spaceService.deleteSpace(spaceId, user.id);
  }

  @Post('role/:spaceId')
  @UseGuards(AccessTokenGuard)
  createSpaceRole(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
    @Body() body: CreateSpaceRoleDto,
  ) {
    return this.spaceService.createSpaceRole(spaceId, user.id, body);
  }

  @Delete('role/:spaceId')
  @UseGuards(AccessTokenGuard)
  deleteSpaceRole(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
    @Body('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.spaceService.deleteSpaceRole(spaceId, user.id, roleId);
  }

}
