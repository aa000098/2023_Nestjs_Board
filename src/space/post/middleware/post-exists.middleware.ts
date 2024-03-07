import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { PostService } from "../post.service";

@Injectable()
export class PostExistsMiddleware implements NestMiddleware {
    constructor(
        private readonly postService: PostService
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const postId = req.params.postId;

        if (!postId || isNaN(parseInt(postId))) {
            throw new BadRequestException('Post ID 파라미터는 필수입니다.');
        }

        const exists = await this.postService.checkPostExistsById(parseInt(postId));

        if (!exists) {
            throw new BadRequestException('Post가 존재하지 않습니다.');
        }

        next();
    }
}