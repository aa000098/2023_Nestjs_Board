import { Controller, Delete, Get, Param, ParseIntPipe, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './entities/user.entity';
import { User } from './decorator/user.decorator';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @IsPublic()
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':userId')
  @IsPublic()
  getUser(
    @User() user: UserModel,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.getUserById(userId, user.id);
  }

  @Delete()
  deleteUser(
    @Req() req: any, 
  ) {
    const userId = req.user.id;
    return this.userService.deleteUser(userId);
  }
}
