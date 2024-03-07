import { SetMetadata } from "@nestjs/common";
import { RoleEnum } from "../const/role.const";

export const ROLE_KEY = 'user_role';

export const Role = (...roles:RoleEnum[]) => SetMetadata(ROLE_KEY, roles);