import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({}),
    forwardRef(()=>UserModule),
  ],
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
