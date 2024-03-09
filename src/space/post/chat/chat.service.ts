import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatModel } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UserService } from 'src/user/user.service';
import { RoleEnum } from 'src/space/role/const/role.const';
import { RoleModel } from 'src/space/role/entities/role.entity';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatModel)
        private readonly chatRepository: Repository<ChatModel>,
        private readonly userService: UserService,
    ) { }

    async getAllChats(spaceId: number, postId: number, userId: number) {
        const role = await this.userService.getRoleOfUser(spaceId, userId);

        const chats = await this.chatRepository.find({
            where: {
                postId,
            },
            relations: {
                writer: true,
                parent: true,
                children: true,
            }
        });

        const filteredChats = chats.map(chat => {
            if (role.authority == RoleEnum.USER) {
                return {
                    ...chat,
                    writerId: chat._writerId,
                    writer: chat._writer,
                    children: chat.children.map(childChat => {
                        if (role.authority == RoleEnum.USER) {
                            return {
                                ...childChat,
                                writerId: childChat._writerId,
                                writer: childChat._writer,
                            }
                        }
                    })
                }
            }
        });

        return filteredChats;
    }

    async getChatById(spaceId: number, chatId: number, userId: number) {
        const role = await this.userService.getRoleOfUser(spaceId, userId);

        const chat = await this.chatRepository.findOne({
            where: {
                id: chatId,
            },
            relations: {
                writer: true,
                parent: true,
                children: true,
            }
        });

        if (role.authority == RoleEnum.USER) {
            return {
                ...chat,
                writerId: chat._writerId,
                writer: chat._writer,
                children: chat.children.map(childChat => {
                    if (role.authority == RoleEnum.USER) {
                        return {
                            ...childChat,
                            writerId: childChat._writerId,
                            writer: childChat._writer,
                        }
                    }
                })
            }
        } else {
            return chat;
        }
    }

    async getMyChat(userId: number) {
        const myChats = await this.chatRepository.find({
            where: {
                writerId: userId,
            }
        });
        return myChats
    }

    async createChat(postId: number, userId: number, chatDto: CreateChatDto) {
        console.log(chatDto)
        const newChat = this.chatRepository.save({
            postId,
            writerId: userId,
            ...chatDto
        });
        return newChat;
    }

    async updateChat(id: number, chatDto: UpdateChatDto) {
        const chatObject = await this.chatRepository.findOne({
            where: {
                id,
            }
        });

        const newChat = await this.chatRepository.save({
            ...chatObject,
            ...chatDto,
        });
        return newChat;
    }

    async deleteChat(id: number) {
        return await this.chatRepository.delete(id);
    }

    async checkChatExistsById(id: number) {
        return await this.chatRepository.exists({
            where: {
                id
            }
        })
    }

    async isChatMine(userId: number, chatId: number) {
        return await this.chatRepository.exists({
            where: {
                id: chatId,
                writerId: userId,
            }
        });
    }

    async getAnonymousChat(chatId: number, role: RoleModel) {
        const chat = await this.chatRepository.findOne({
            where: {
                id: chatId,
            }
        });

        const children = chat.children;

        const anonymousChat = {
            id: chat.id,
            createdAt: chat.createdAt,
            updatedAt: chat.updatedAt,
            parentId: chat.parentId,
            content: chat.content,
            isAnonymous: chat.isAnonymous,
            likeCount: chat.likeCount,
            parent: chat.parent,
            children: children
        }

        return anonymousChat;
    }
}
