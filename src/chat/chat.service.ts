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
    
    async getAllChats() {
        const chats = this.chatRepository.find();
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

    async createChat(chatDto: CreateChatDto) {
        const chatObject = this.chatRepository.create({
            ...chatDto
        });
        const newChat = this.chatRepository.save(chatObject);
        return newChat;
    }

    async updateChat(id: number, chatDto: UpdateChatDto) {
        const chatObject = await this.chatRepository.findOne({
            where: {
                id,
            }
        });
        const updatedPost = await this.chatRepository.create({
            ...chatObject,
            ...chatDto,
        });
        const newChat = await this.chatRepository.save(updatedPost);
        return newChat;
    }

    async deleteChat(id: number) {
        return await this.chatRepository.delete(id);
    }
}
