import { Module } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceModel } from './entities/space.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { PostModule } from './post/post.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceModel]),
    UserModule,
    AuthModule,
    PostModule,
    RoleModule,
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule {}
