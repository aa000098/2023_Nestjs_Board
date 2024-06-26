import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStateEnum } from './const/post-state.const';
import { RoleEnum } from '../role/const/role.const';
import { UserService } from 'src/user/user.service';
import { POST_FOLDER_PATH, TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { basename, join } from 'path';
import {promises} from 'fs';

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(PostModel)
        private readonly postRepository: Repository<PostModel>,
        private readonly userService: UserService,
    ) { }

    async getAllPosts(spaceId: number, userId: number) {
        const role = await this.userService.getRoleOfUser(spaceId, userId);

        const posts = await this.postRepository.find({
            where: {
                spaceId
            },
            relations: {
                writer: true,
            }
        });

        const filteredPosts = posts.map(post => {
            if (role.authority==RoleEnum.USER) {
                return {
                    ...post,
                    writerId: post._writerId,
                    writer: post._writer
                }
            } else {
                return post
            }
        });

        return filteredPosts;
    }

    async getPostById(spaceId: number, postId: number, userId: number) {
        const role = await this.userService.getRoleOfUser(spaceId, userId);

        const post = await this.postRepository.findOne({
            select: [],
            where: {
                id: postId,
            },
            relations: {
                writer: true,
            }
        });

        if (role.authority==RoleEnum.USER) {
            return {
                ...post,
                writerId: post._writerId,
                writer: post._writer
            }
        } else {
            return post
        } 
    }

    async getMyPost(userId: number) {
        const posts = await this.postRepository.find({
            where: {
                writerId: userId
            }
        });

        return posts;
    }

    async createPostFile(file: string) {
        const tempFilePath = join(TEMP_FOLDER_PATH, file);

        try {
            await promises.access(tempFilePath);
        } catch (e) {
            throw new BadRequestException('존재하지 않는 파일 입니다.');
        }

        const fileName = basename(tempFilePath);
        const newPath = join(POST_FOLDER_PATH, fileName);

        await promises.rename(tempFilePath, newPath);

        return true; 
    }

    async createPost(spaceId: number, userId: number, postDto: CreatePostDto) {
        const newPost = await this.postRepository.save({
            spaceId,
            writerId: userId,
            ...postDto
        });
        if (postDto.file) {
            this.createPostFile(postDto.file);
        }
        if (postDto.image) {
            this.createPostFile(postDto.image);
        }
        return newPost;
    }

    async updatePost(id: number, postDto: UpdatePostDto) {
        const post = await this.postRepository.findOne({
            where: {
                id,
            }
        });

        const updatedPost = this.postRepository.save({
            ...post,
            ...postDto,
            postState: PostStateEnum.M,
        });
        return updatedPost;
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

    async isPostMine(userId: number, postId: number) {
        return this.postRepository.exists({
            where: {
                id: postId,
                writerId: userId,
            },
        });
    }
}
