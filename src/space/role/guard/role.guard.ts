import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLE_KEY } from "../decorator/authority.decorator";
import { UserService } from "src/user/user.service";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly reflector: Reflector
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const requiredRole: Array<string> = this.reflector.getAllAndOverride(
            ROLE_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]);

        if (!requiredRole) {
            return true;
        }

        const { user, params } = req;

        if (!user) {
            throw new UnauthorizedException(
                '다시 로그인 해주세요',
            );
        }

        const spaceId = params.spaceId;

        const userRole = await this.userService.getRoleOfUser(spaceId, user.id);

        if (!requiredRole.includes(userRole.authority)) {
            throw new ForbiddenException('권한이 없습니다.');
        }
        
        req.userRole = userRole;

        return true;
    }
}