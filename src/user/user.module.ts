import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModel } from './entities/user.entity';
import { SpaceUserBridgeModel } from './entities/space_user_bridge.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel, SpaceUserBridgeModel]),
  ],
  exports: [
    UserService,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
