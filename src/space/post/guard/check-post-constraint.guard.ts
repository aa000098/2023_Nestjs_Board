import { BadRequestException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "src/user/user.service";
import { CreatePostDto } from "../dto/create-post.dto";
import { PostTypeEnum } from "../const/post-type.const";
import { RoleEnum } from "src/space/role/const/role.const";

@Injectable()
export class CheckPostConstraint implements CanActivate {
    constructor(
        private readonly userService: UserService,
    ) { }
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()
        const { user, params, body } = req;
        const { spaceId } = params;
        const postDto : CreatePostDto = body;
        const role = await this.userService.getRoleOfUser(spaceId, user.id);

        if (postDto.postType==PostTypeEnum.N && role.authority==RoleEnum.USER) {
            throw new UnauthorizedException('관리자 권한이 없습니다.');
        }
        
        if (postDto.isAnonymous==true && role.authority!=RoleEnum.USER) {
            throw new BadRequestException('관리자는 익명으로 글을 쓸 수 없습니다.');
        }

        return true;
    }
}