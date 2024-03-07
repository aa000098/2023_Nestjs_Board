import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { RoleEnum } from "src/space/role/const/role.const";
import { UserService } from "src/user/user.service";
import { PostService } from "../post.service";

@Injectable()
export class IsPostMineOrAdmin implements CanActivate {
    constructor(
        private readonly userService: UserService,
        private readonly postService: PostService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest()

        const {user, params} = req;

        const {spaceId, postId} = params;

        const userRole = await this.userService.getRoleOfUser(spaceId, user.id);

        console.log(userRole)
        if (userRole.authority === RoleEnum.ADMIN || userRole.authority===RoleEnum.OWNER) {
            return true;
        }

        return await this.postService.isPostMine(user.id, postId);
    }
}