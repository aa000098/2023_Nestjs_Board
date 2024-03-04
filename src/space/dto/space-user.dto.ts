import { PickType } from "@nestjs/mapped-types";
import { UserModel } from "src/user/entities/user.entity";

export class SpaceUserDto extends PickType(UserModel, ['email']) {
    spaceId: number;
}