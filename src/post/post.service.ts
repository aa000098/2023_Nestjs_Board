import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PostModel } from './entities/post.entity';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStateEnum } from './const/post-state.const';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostModel)
        private readonly postRepository: Repository<PostModel>,
    ) {}

    async getAllPosts() {
        const posts = await this.postRepository.find();
        return posts
    }

    async getPostById(id: number) {
        const post = await this.postRepository.findOne({
            where: {
                id,
            }
        });
        return post;
    }

    async createPost(postDto: CreatePostDto) {
        const postObject = await this.postRepository.create({
            ...postDto
        });

        const newPost = await this.postRepository.save(postObject);
        return newPost;
    }

    async updatePost(id: number, postDto: UpdatePostDto) {
        const postObject = await this.postRepository.findOne({
            where: {
                id,
            }
        });
        const updatedPost = await this.postRepository.create({
            ...postObject,
            ...postDto,
            postState: PostStateEnum.M,
        });
        const newPost = await this.postRepository.save(updatedPost);
        return newPost;
    }

    async deletePost(id: number) {
        return await this.postRepository.delete(id);
    }
}
