import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { ChatService } from "../chat.service";
import { RoleEnum } from "src/space/role/const/role.const";
import { CreateChatDto } from "../dto/create-chat.dto";

@Injectable()
export class CheckChatConstraint implements CanActivate {
    constructor(
        private readonly userService: UserService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const { user, params, body } = req;
        const { spaceId } = params;
        const chatDto : CreateChatDto = body;
        const role = await this.userService.getRoleOfUser(spaceId, user.id);

        if (chatDto.isAnonymous && role.authority != RoleEnum.USER) {
            throw new BadRequestException('관리자는 익명으로 댓글을 쓸 수 없습니다.');
        }

        return true;
    }
}