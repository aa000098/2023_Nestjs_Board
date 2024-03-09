import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './user/decorator/user.decorator';
import { UserModel } from './user/entities/user.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('myPost')
  getMyPost(
    @User() user: UserModel,
  ) {
    return this.appService.getMyPost(user.id);
  }

  @Get('myChat')
  getMyChat(
    @User() user: UserModel,
  ) {
    return this.appService.getMyChat(user.id);
  }
}
