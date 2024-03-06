import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleModel } from './entities/role.entity';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UserService } from 'src/user/user.service';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RoleService {
    constructor(
        @InjectRepository(RoleModel)
        private readonly roleRepository: Repository<RoleModel>,

        private readonly userService: UserService,
    ) {}

    async getRoles(spaceId: number) {
        return this.roleRepository.find({
            where: {
                spaceId,
            }
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

    async createRole(spaceId, roleDto: CreateRoleDto) {
        const entryCode = this.generateEntryCode();
        const existCode = this.roleRepository.exists({
            where: {
                entryCode,
            }
        });
        if (existCode) {
            throw new InternalServerErrorException('중복 코드가 생성되었습니다.');
        }

        const defaultRole = await this.roleRepository.save({
            spaceId,
            ...roleDto,
            entryCode,
        });
        return defaultRole;
    }

    async createDefaultRole(spaceId: number) {
        const roleDto = {roleName: '소유자', isAdministrator: true};
        const defaultRole = await this.createRole(spaceId, roleDto);
        return defaultRole;
    }

    async createNewRole(spaceId: number, userId: number, roleDto: CreateRoleDto) {
        const { roleName } = roleDto;

        const userRole = await this.userService.getRoleOfUser(spaceId, userId);

        if (!userRole || !userRole.isAdministrator) {
            throw new Error('권한이 없는 사용자입니다.')
        }

        const existingRole = await this.roleRepository.exists({
            where: {
                spaceId,
                roleName
            }
        });

        if (existingRole) {
            throw new Error('이미 존재하는 이름의 역할입니다.');
        }

        const newRole = await this.createRole(spaceId, roleDto);
        return newRole;
    }
    
    async updateRole(spaceId:number, userId: number, roleId: number, roleDto: UpdateRoleDto) {
        const userRole = await this.userService.getRoleOfUser(spaceId, userId)

        if (!userRole.isAdministrator) {
            throw new Error('관리자가 아닙니다.');
        }

        const role = await this.roleRepository.findOne({
            where: {
                id: roleId
            }
        });

        if (!role) {
            throw new Error('Space에 없는 역할입니다.');
        }

        const updatedRole = await this.roleRepository.save({
            ...role,
            ...roleDto,
        });
        return updatedRole;

        
    }

    async deleteRole(spaceId:number, userId: number, roleId: number) {
        const userRole = await this.userService.getRoleOfUser(spaceId, userId)

        if (!userRole.isAdministrator) {
            throw new Error('관리자가 아닙니다.');
        }

        const isRoleInUse = await this.userService.isRoleInUse(roleId);
        
        if (isRoleInUse) {
            throw new BadRequestException('해당 역할을 사용중인 유저가 있습니다.');
        }

        return await this.roleRepository.delete({id: roleId});
    }
}
