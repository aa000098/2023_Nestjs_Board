import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatModel } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';

@Injectable()
export class ChatService {
    constructor(
        @InjectRepository(ChatModel)
        private readonly chatRepository: Repository<ChatModel>,
    ) {}
    
    async getAllChats(postId: number) {
        const chats = this.chatRepository.find({
            where: {
                postId,
            }
        });
        return chats;
    }

    async getChatById(id: number){
        const chat = this.chatRepository.findOne({
            where: {
                id,
            }
        });

        if (!chat) {
            throw new BadRequestException('해당 댓글은 존재하지 않습니다.');
        }
        return chat;
    }

    async createChat(postId: number, userId: number, chatDto: CreateChatDto) {
        const newChat = this.chatRepository.save({
            postId,
            writerId: userId,
            ...chatDto
        });
        return newChat;
    }

    async updateChat(id: number, userId: number, chatDto: UpdateChatDto) {
        const chatObject = await this.chatRepository.findOne({
            where: {
                id,
            }
        });

        if (chatObject.writerId!= userId) {
            throw new UnauthorizedException('권한이 없습니다.');
        }

        const newChat = await this.chatRepository.save({
            ...chatObject,
            ...chatDto,
        });
        return newChat;
    }

    async deleteChat(id: number, userId: number) {
        const chatObject = await this.chatRepository.findOne({
            where: {
                id,
            }
        });

        if (chatObject.writerId!= userId) {
            throw new UnauthorizedException('권한이 없습니다.');
        }

        return await this.chatRepository.delete(id);
    }
}
