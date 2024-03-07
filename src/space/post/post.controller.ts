import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer_token.guard';
import { User } from 'src/user/decorator/user.decorator';
import { UserModel } from 'src/user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsPublic } from 'src/common/decorator/is-public.decorator';

@Controller('space/:spaceId/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @IsPublic()
  getPosts(
    @Param('spaceId', ParseIntPipe) spaceId: number,
  ) {
    return this.postService.getAllPosts(spaceId);
  }

  @Get(':postId')
  @IsPublic()
  getPost(
    @Param('postId', ParseIntPipe) postId: number
  ) {
    return this.postService.getPostById(postId);
  }

  @Post()
  postPost(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Body() body: CreatePostDto,
    @User() user: UserModel,
  ) {
    return this.postService.createPost(spaceId, user.id, body);
  }

  @Patch(':postId')
  patchPost(
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: UserModel,
    @Body() body: UpdatePostDto,
  ) {
    return this.postService.updatePost(postId, user.id, body);
  }

  @Delete(':postId')
  deletePost(
    @User() user: UserModel,
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postService.deletePost(postId, user.id);
  }
}
