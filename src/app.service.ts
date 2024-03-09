import { Injectable } from '@nestjs/common';
import { PostService } from './space/post/post.service';
import { ChatService } from './space/post/chat/chat.service';

@Injectable()
export class AppService {
  constructor(
    private readonly postService: PostService,
    private readonly chatService: ChatService,
  ) { }

  getHello(): string {
    return 'Hello World!';
  }

  async getMyPost(userId: number) {
    const posts = await this.postService.getMyPost(userId);
    return posts;
  }

  async getMyChat(userId: number) {
    const chats = await this.chatService.getMyChat(userId);
    return chats;
  }
}
