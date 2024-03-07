import { Body, Controller, Delete, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { BasicTokenGuard } from './guard/basic_token.guard';
import { BearerTokenGuard, RefreshTokenGuard } from './guard/bearer_token.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @IsPublic()
  postRegisterUser(
    @Body() body: RegisterUserDto,
  ) {
    return this.authService.registerUser(body);
  }

  @Post('login')
  @IsPublic()
  @UseGuards(BasicTokenGuard)
  async postLoginUser(
    @Req() req: any,
    @Res() res: any,
  ) {
    const {accessToken, refreshToken} = await this.authService.getToken(req.user);
    res.cookie('accessToken', accessToken, {httpOnly: true});
    res.cookie('refreshToken', refreshToken, {httpOnly: true});
    res.send({
      message: 'success'
    });
  }

  @Patch('edit')
  @UseGuards(BearerTokenGuard)
  async patchUser(
    @Req() req: any,
    @Body() body: UpdateUserDto,
  ) {
    const user = req.user;
    return this.authService.updateUser(user, body);
  }

  @Delete('logout')
  @IsPublic()
  logout(
    @Res() res: any,
  ) {
    res.cookie('accessToken', '', { maxAge: 0 });
    res.cookie('refreshToken', '', { maxAge: 0 });
    res.send({
      message: 'success'
    });
  }

  @Post('token/access')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postTokenAccess(
    @Req() req: any,
    @Res() res: any,
  ) {
    const token = req.token;

    const newToken = this.authService.rotateToken(token, false);

    res.cookie('accessToken', newToken, { httpOnly: true });
    res.send({
      message: 'success'
    });
  }

  @Post('token/refresh')
  @IsPublic()
  @UseGuards(RefreshTokenGuard)
  postTokenRefresh(
    @Req() req: any,
    @Res() res: any,
  ) {
    const token = req.token;

    const newToken = this.authService.rotateToken(token, true);

    res.cookie('refreshToken', newToken, { httpOnly: true });
    res.send({
      message: 'success'
    });
  }
}
