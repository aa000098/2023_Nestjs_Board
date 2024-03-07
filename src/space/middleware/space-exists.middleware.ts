import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { SpaceService } from "src/space/space.service";

@Injectable()
export class SpaceExistsMiddleware implements NestMiddleware {
    constructor(
        private readonly spaceService: SpaceService,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
        const spaceId = req.params.spaceId;

        if (!spaceId || isNaN(parseInt(spaceId))) {
            throw new BadRequestException('Space ID 파라미터는 필수입니다.');
        }

        const exists = await this.spaceService.checkSpaceExistsById(parseInt(spaceId));

        if (!exists) {
            throw new BadRequestException('Space가 존재하지 않습니다.');
        }
        next();
    }
}