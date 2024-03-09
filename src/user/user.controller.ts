import { Controller, Delete, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { UserModel } from './entities/user.entity';
import { User } from './decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':userId')
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
