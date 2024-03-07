import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostModel } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostStateEnum } from './const/post-state.const';
import { RoleEnum } from '../role/const/role.const';
import { UserService } from 'src/user/user.service';

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
            select: [],
            where: {
                spaceId
            },
            relations: {
                writer: true,
            }
        });

        const filteredPosts = posts.map(post => {
            if (post.isAnonymous && role.authority==RoleEnum.USER) {
                return {
                    id: post.id,
                    createdAt: post.createdAt,
                    updatedAt: post.updatedAt,
                    spaceId: post.spaceId,
                    postType: post.postType,
                    postTitle: post.postTitle,
                    postState: post.postState,
                    content: post.content,
                    image: post.image,
                    file: post.file,
                    isAnonymous: post.isAnonymous,
                    curiosity: post.curiosity,
                }
            } else {
                return {
                    ...post,
                    writer: {
                        id: post.writer.id,
                        userName: post.writer.userName,
                        profileImage: post.writer.profileImage,
                        gender: post.writer.gender,
                    }
                };
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

        if (post.isAnonymous && role.authority==RoleEnum.USER) {
            return {
                id: post.id,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                spaceId: post.spaceId,
                postType: post.postType,
                postTitle: post.postTitle,
                postState: post.postState,
                content: post.content,
                image: post.image,
                file: post.file,
                isAnonymous: post.isAnonymous,
                curiosity: post.curiosity,
            }
        } else {
            return {
                ...post,
                writer: {
                    id: post.writer.id,
                    userName: post.writer.userName,
                    profileImage: post.writer.profileImage,
                    gender: post.writer.gender,
                }
            };
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

    async createPost(spaceId: number, userId: number, postDto: CreatePostDto) {
        const newPost = await this.postRepository.save({
            spaceId,
            writerId: userId,
            ...postDto
        });
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
