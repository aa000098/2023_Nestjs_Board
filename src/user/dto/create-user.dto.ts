import { PickType } from "@nestjs/mapped-types";
import { UserModel } from "../entities/user.entity";

export class CreateUserDto extends PickType(UserModel, ['userName', 'password', 'gender', 'profileImage']) {}