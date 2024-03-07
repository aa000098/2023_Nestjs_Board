import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { ChatService } from "../chat.service";


@Injectable()
export class ChatExistsMiddleware implements NestMiddleware {
    constructor(
        private readonly postService: ChatService
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const postId = req.params.postId;

        if (!postId || isNaN(parseInt(postId))) {
            throw new BadRequestException('Chat ID 파라미터는 필수입니다.');
        }

        const exists = await this.postService.checkChatExistsById(parseInt(postId));

        if (!exists) {
            throw new BadRequestException('Chat이 존재하지 않습니다.');
        }

        next();
    }
}