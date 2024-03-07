import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { ChatService } from "../chat.service";
import { RoleEnum } from "src/space/role/const/role.const";

@Injectable()
export class IsChatMineOrAdmin implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly chatService: ChatService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()

        const {user, params} = req;

        const {spaceId, chatId} = params;

        const userRole = await this.userService.getRoleOfUser(spaceId, user.id);

        if (userRole.authority === RoleEnum.ADMIN || userRole.authority===RoleEnum.OWNER) {
            return true;
        }

        return await this.chatService.isChatMine(user.id, chatId);
    }
}