import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { User } from 'src/user/decorator/user.decorator';
import { UserModel } from 'src/user/entities/user.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IsPostMineOrAdmin } from './guard/is-post-mine-or-admin.guard';
import { CheckPostConstraint } from './guard/check-post-constraint.guard';

@Controller('space/:spaceId/post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel
  ) {
    return this.postService.getAllPosts(spaceId, user.id);
  }

  @Get(':postId')
  getPost(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('postId', ParseIntPipe) postId: number,
    @User() user: UserModel
  ) {
    return this.postService.getPostById(spaceId, postId, user.id);
  }

  @Post()
  @UseGuards(CheckPostConstraint)
  postPost(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Body() body: CreatePostDto,
    @User() user: UserModel,
  ) {
    return this.postService.createPost(spaceId, user.id, body);
  }

  @Patch(':postId')
  @UseGuards(IsPostMineOrAdmin)
  patchPost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postService.updatePost(postId, body);
  }

  @Delete(':postId')
  @UseGuards(IsPostMineOrAdmin)
  deletePost(
    @Param('postId', ParseIntPipe) postId: number,
  ) {
    return this.postService.deletePost(postId);
  }
}
