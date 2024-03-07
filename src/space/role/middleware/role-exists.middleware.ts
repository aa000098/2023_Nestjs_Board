import { BadRequestException, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { RoleService } from "../role.service";

@Injectable()
export class RoleExistsMiddleware implements NestMiddleware {
    constructor(
        private readonly roleService: RoleService,
    ) {}
    
    async use(req: Request, res: Response, next: NextFunction) {
        const roleId = req.params.roleId;

        if (!roleId || isNaN(parseInt(roleId))) {
            throw new BadRequestException('Space ID 파라미터는 필수입니다.');
        }

        const exists = await this.roleService.checkRoleExistsById(parseInt(roleId));

        if (!exists) {
            throw new BadRequestException('Role이 존재하지 않습니다.');
        }
        next();
    }
}