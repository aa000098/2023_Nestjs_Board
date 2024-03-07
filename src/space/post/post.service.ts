import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStateEnum } from './const/post-state.const';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostModel)
        private readonly postRepository: Repository<PostModel>,
    ) { }

    async getAllPosts(spaceId: number) {
        const posts = await this.postRepository.find({
            where: {
                spaceId
            }
        });
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

    async createPost(spaceId: number, userId: number, postDto: CreatePostDto) {
        const postObject = await this.postRepository.create({
            spaceId,
            writerId: userId,
            ...postDto
        });

        const newPost = await this.postRepository.save(postObject);
        return newPost;
    }

    async updatePost(id: number, postDto: UpdatePostDto) {
        const post = await this.postRepository.findOne({
            where: {
                id,
            }
        });

        const updatedPost = this.postRepository.create({
            ...post,
            ...postDto,
            postState: PostStateEnum.M,
        });
        const newPost = await this.postRepository.save(updatedPost);
        return newPost;
    }

    async deletePost(id: number) {
        return await this.postRepository.delete(id);
    }

    async checkPostExistsById(id: number) {
        return await this.postRepository.exists({
            where: {
                id
            }
        });
    }
}
