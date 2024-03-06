import { ClassSerializerInterceptor, Controller, Delete, Get, Param, ParseIntPipe, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer_token.guard';
import { UserModel } from './entities/user.entity';
import { User } from './decorator/user.decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':userId')
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  getUser(
    @User() user: UserModel,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    return this.userService.getUserById(userId, user.id);
  }

  @Delete()
  @UseGuards(AccessTokenGuard)
  deleteUser(
    @Req() req: any, 
  ) {
    const userId = req.user.id;
    return this.userService.deleteUser(userId);
  }
}
