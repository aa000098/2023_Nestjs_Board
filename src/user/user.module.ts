import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { SpaceUserBridgeModel } from './entities/space_user_bridge.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, SpaceUserBridgeModel]),
    forwardRef(()=>AuthModule)
  ],
  exports: [
    UserService,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
