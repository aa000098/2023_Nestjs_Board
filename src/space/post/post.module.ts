import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { PostModel } from './entities/post.entity';
import { SpaceModule } from '../space.module';
import { ChatController } from './chat/chat.controller';
import { PostExistsMiddleware } from './middleware/post-exists.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel]),
    AuthModule,
    UserModule,
    SpaceModule,
  ],
  exports: [PostService],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(PostExistsMiddleware)
    .exclude(
      { path: 'space/:spaceId/post/mypost', method: RequestMethod.GET}
    )
    .forRoutes(
      ChatController,
      {path: 'space/:spaceId/post/:postId', method: RequestMethod.ALL}
    )
  }
}
