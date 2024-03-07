import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from './entities/role.entity';
import { Not, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UserService } from 'src/user/user.service';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleEnum } from './const/role.const';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleModel)
        private readonly roleRepository: Repository<RoleModel>,

        private readonly userService: UserService,
    ) { }

    async getRoles(spaceId: number) {
        return this.roleRepository.find({
            where: {
                spaceId,
                authority: Not(RoleEnum.OWNER)
            },
        });
    }

    generateEntryCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let entryCode = '';
        for (let i = 0; i < 8; i++) {
            entryCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return entryCode;
    }

    async createRole(spaceId: number, roleDto: CreateRoleDto) {
        const entryCode = this.generateEntryCode();
        const existCode = await this.roleRepository.exists({
            where: {
                entryCode,
            }
        });
        if (existCode) {
            throw new InternalServerErrorException('중복 코드가 생성되었습니다.');
        }

        const role = await this.roleRepository.save({
            spaceId,
            ...roleDto,
            entryCode,
        });
        return role;
    }

    async createDefaultRole(spaceId: number) {
        const defaultRole = this.createRole(spaceId, { roleName: '소유자', 'authority': RoleEnum.OWNER });
        return defaultRole;
    }

    async createNewRole(spaceId: number, roleDto: CreateRoleDto) {
        const { roleName } = roleDto;

        const existingRole = await this.roleRepository.exists({
            where: {
                spaceId,
                roleName
            }
        });

        if (existingRole) {
            throw new BadRequestException('이미 존재하는 이름의 역할입니다.');
        }

        const newRole = await this.createRole(spaceId, roleDto);
        return newRole;
    }

    async updateRole(roleId: number, roleDto: UpdateRoleDto) {
        const role = await this.roleRepository.findOne({
            where: {
                id: roleId
            }
        });

        if (role.authority == RoleEnum.OWNER || roleDto.authority == RoleEnum.OWNER) {
            throw new BadRequestException('소유자 역할은 변경할 수 없습니다.');
        }

        if (roleDto.roleName) {
            const existingRole = await this.roleRepository.exists({
                where: {
                    spaceId: role.spaceId,
                    roleName: roleDto.roleName
                }
            });

            if (existingRole) {
                throw new BadRequestException('이미 존재하는 이름의 역할입니다.');
            }
        }

        const updatedRole = await this.roleRepository.save({
            ...role,
            ...roleDto,
        });
        return updatedRole;
    }

    async updateUserRole(spaceId: number, roleId: number, userId: number, changerAuthority: RoleEnum) {
        const role = await this.roleRepository.findOne({
            where: {
                id: roleId,
            }
        });
        console.log(changerAuthority)

        if (role.authority==RoleEnum.OWNER) {
            if (changerAuthority!=RoleEnum.OWNER) {
                throw new BadRequestException('소유자 역할은 소유자만 부여할 수 있습니다.');
            }
        }

        const changedRole = await this.userService.setRoleOfUser(spaceId, userId, role);

        return changedRole;
    }

    async deleteRole(roleId: number) {
        const isRoleInUse = await this.userService.isRoleInUse(roleId);

        if (isRoleInUse) {
            throw new BadRequestException('해당 역할을 사용중인 유저가 있습니다.');
        }

        return await this.roleRepository.delete({ id: roleId });
    }

    async checkRoleExistsById(id: number) {
        return this.roleRepository.exists({
            where: {
                id,
            }
        });
    }
}
