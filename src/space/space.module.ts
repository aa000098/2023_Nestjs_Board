import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceModel } from './entities/space.entity';
import { SpaceRoleModel } from './entities/space-role.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceModel, SpaceRoleModel]),
    UserModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
