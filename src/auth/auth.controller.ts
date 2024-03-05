import { Body, ClassSerializerInterceptor, Controller, Get, Patch, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BasicTokenGuard } from './guard/basic_token.guard';
import { BearerTokenGuard, RefreshTokenGuard } from './guard/bearer_token.guard';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseInterceptors(ClassSerializerInterceptor)
  postRegisterUser(
    @Body() body: RegisterUserDto,
  ) {
    return this.authService.registerUser(body);
  }

  @Post('login')
  @UseGuards(BasicTokenGuard)
  async postLoginUser(
    @Req() req: any,
    @Res() res: any,
  ) {
    const {accessToken, refreshToken} = await this.authService.getToken(req.user);
    res.cookie('accessToken', accessToken, {httpOnly: true});
    res.cookie('refreshToken', refreshToken, {httpOnly: true});
    return res.send({
      message: 'success'
    });
  }

  @Patch('edit')
  @UseInterceptors(ClassSerializerInterceptor)
  @UseGuards(BearerTokenGuard)
  async patchUser(
    @Req() req: any,
    @Body() body: UpdateUserDto,
  ) {
    const user = req.user;
    return this.authService.updateUser(user, body);
  }

  @Get('logout')
  logout(
    @Res() res: any,
  ) {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
    return res.send({
      message: 'success'
    });
  }

  @Post('token/access')
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(
    @Req() req: any,
    @Res() res: any,
  ) {
    const token = req.token;

    const newToken = this.authService.rotateToken(token, false);

    res.cookie('accessToken', newToken, { httpOnly: true });
    return res.send({
      message: 'success'
    });
  }

  @Post('token/refresh')
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(
    @Req() req: any,
    @Res() res: any,
  ) {
    const token = req.token;

    const newToken = this.authService.rotateToken(token, true);

    res.cookie('refreshToken', newToken, { httpOnly: true });
    return res.send({
      message: 'success'
    });
  }
}
