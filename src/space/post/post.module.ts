import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { PostModel } from './entities/post.entity';
import { SpaceExistsMiddleware } from './middleware/space-exists.middleware';
import { SpaceModule } from '../space.module';
import { ChatController } from './chat/chat.controller';
import { RoleController } from '../role/role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel]),
    AuthModule,
    UserModule,
    SpaceModule,
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(SpaceExistsMiddleware)
    .forRoutes(PostController, ChatController, RoleController);
  }
}
