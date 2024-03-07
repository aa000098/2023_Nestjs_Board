import { Injectable } from '@nestjs/common';
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
}
