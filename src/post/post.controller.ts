import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  getPosts() {
    return this.postService.getAllPosts();
  }

  @Get(':id')
  getPost(
    @Param('id', ParseIntPipe) id: number
  ) {
    return this.postService.getPostById(id);
  }

  @Post()
  postPost(
    @Body() body: CreatePostDto,
  ) {
    return this.postService.createPost(body);
  }

  @Patch(':id')
  patchPost(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePostDto,
  ) {
    return this.postService.updatePost(id, body);
  }

  @Delete(':id')
  deletePost(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postService.deletePost(id);
  }
}
