import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatModel } from './entities/chat.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { ChatExistsMiddleware } from './middleware/chat-exists.middleware';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ChatModel,
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(ChatExistsMiddleware)
    .forRoutes(
      ChatController,
      {path: 'space/:spaceId/post/:postId/chat/:chatId*', method: RequestMethod.ALL}
    )
  }
}

