import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { SpaceService } from './space.service';
import { SpaceController } from './space.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceModel } from './entities/space.entity';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { RoleModule } from './role/role.module';
import { SpaceExistsMiddleware } from './post/middleware/space-exists.middleware';
import { PostController } from './post/post.controller';
import { ChatController } from './post/chat/chat.controller';
import { RoleController } from './role/role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([SpaceModel]),
    UserModule,
    AuthModule,
    RoleModule,
  ],
  exports: [
    SpaceService,
  ],
  controllers: [SpaceController],
  providers: [SpaceService],
})
export class SpaceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(SpaceExistsMiddleware)
    .forRoutes(
      PostController, ChatController, RoleController,
      {path: 'space/:spaceId*', method: RequestMethod.ALL}
    )
  }
}
