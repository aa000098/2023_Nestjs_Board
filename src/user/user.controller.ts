import { ClassSerializerInterceptor, Controller, Delete, Get, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer_token.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers() {
    return this.userService.getAllUsers();
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
