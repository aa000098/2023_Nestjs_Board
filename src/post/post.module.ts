import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostModel } from './entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel])
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
