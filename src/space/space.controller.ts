import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Post, UseInterceptors } from '@nestjs/common';
import { SpaceService } from './space.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UserModel } from 'src/user/entities/user.entity';
import { SpaceUserDto} from './dto/space-user.dto';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';

@Controller('space')
export class SpaceController {
  constructor(private readonly spaceService: SpaceService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getSpaces() {
    return this.spaceService.getAllSpaces();
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  postSpace(
    @Body('email') email: Pick<UserModel, 'email'>, 
    @Body() body: CreateSpaceDto,
  ) {
    return this.spaceService.createSpace(email, body);
  }

  @Get('role')
  getSpaceRole() {
    return this.spaceService.getAllSpaceRole();
  }

  @Post('join')
  joinSpace(
    @Body() body: SpaceUserDto,
    @Body('entrycode') entryCode: string,
  ) {
    return this.spaceService.addUserToSpace(body, entryCode);
  }

  @Delete('withdraw')
  withdrawSpace(
    @Body() body: SpaceUserDto,
  ) {
    return this.spaceService.deleteUserFromSpace(body);
  }

  @Delete()
  deleteSpace(
    @Body() body: SpaceUserDto,
  ) {
    return this.spaceService.deleteSpace(body);
  }

  @Post('role')
  createSpaceRole(
    @Body('email') email: number,
    @Body() body: CreateSpaceRoleDto,
  ) {
    return this.spaceService.createSpaceRole(email, body);
  }

  @Delete('role')
  deleteSpaceRole(
    @Body() body,
  ) {
    return this.spaceService.deleteSpaceRole(body);
  }

}
