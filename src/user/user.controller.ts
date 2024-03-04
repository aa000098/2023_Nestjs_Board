import { Body, ClassSerializerInterceptor, Controller, Delete, Get, Patch, Post, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { GendersEnum } from './const/gender.const';
import { CreateUserDto } from './dto/create-user.dto';
import { UserModel } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dt';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseInterceptors(ClassSerializerInterceptor)
  getUsers() {
    return this.userService.getAllUsers();
  }

  @Post()
  @UseInterceptors(ClassSerializerInterceptor)
  postUser(
    @Body('email') email: Pick<UserModel, 'email'>,
    @Body() body: CreateUserDto,
  ) {
    return this.userService.createUser(email, body);
  }
 
  @Patch()
  patchUser(
    @Body('email') email: Pick<UserModel, 'email'>, 
    @Body() body: UpdateUserDto,
  ) {
    return this.userService.updateUser(email, body)
  }

  @Delete()
  deleteUser(
    @Body('email') email: Pick<UserModel, 'email'>, 
  ) {
    return this.userService.deleteUser(email);
  }
}
