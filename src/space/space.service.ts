import { Repository } from 'typeorm';
import { SpaceModel } from './entities/space.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRoleModel } from './entities/space-role.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UserService } from 'src/user/user.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';

@Injectable()
export class SpaceService {
    constructor(
        @InjectRepository(SpaceModel)
        private readonly spaceRepository: Repository<SpaceModel>,

        @InjectRepository(SpaceRoleModel)
        private readonly spaceRoleRepository: Repository<SpaceRoleModel>,

        private readonly userService: UserService,
    ) { }

    async getAllSpaces() {
        const spaces = await this.spaceRepository.find({
            relations: ['owner', 'spaceRoles', 'participatingUsers']
        });
        return spaces
    }

    generateEntryCode() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let entryCode = '';
        for (let i = 0; i < 8; i++) {
            entryCode += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return entryCode;
    }

    async createSpace(ownerId: number, spaceDto: CreateSpaceDto) {
        const { spaceName, spaceLogo, spaceRoles } = spaceDto;
        const newSpace = await this.spaceRepository.save({
            ownerId,
            spaceName,
            spaceLogo,
        });

        const spaceId = newSpace.id;

        const ownerEntryCode = this.generateEntryCode();
        await this.spaceRoleRepository.save({
            spaceId, role: '소유자', isAdministrator: true, entryCode: ownerEntryCode
        });

        for (const spaceRoleDto of spaceRoles) {
            const { role, isAdministrator } = spaceRoleDto;
            const entryCode = this.generateEntryCode();
            const spaceRoleObject = await this.spaceRoleRepository.create({
                spaceId, role, isAdministrator, entryCode
            });
            await this.spaceRoleRepository.save(spaceRoleObject);
        };

        const space = this.addUserToSpace( spaceId, ownerId, ownerEntryCode);

        return space;
    }

    async getSpaceRole(spaceId: number) {
        return this.spaceRoleRepository.find({
            where: {
                spaceId,
            }
        });
    }

    async addUserToSpace(spaceId: number, userId: number, entryCode: string) {
        const space = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['spaceRoles', 'participatingUsers']
        });

        if (!space) {
            throw new Error('Space가 없습니다.');
        }

        const spaceRoles = space.spaceRoles;
        const spaceRole = spaceRoles.find((spaceRole) => {
            return spaceRole.entryCode == entryCode;
        });

        if (!spaceRole) {
            throw new Error('입장 코드가 틀렸습니다.')
        }

        const bridge = await this.userService.createBridge(spaceId, userId, spaceRole);

        if (!bridge) {
            throw new Error('이미 존재하는 유저입니다.');
        }

        const updatedSpace = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['spaceRoles', 'participatingUsers']
        });
        return updatedSpace;
    }

    async deleteUserFromSpace(spaceId, userId) {
        const space = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['spaceRoles', 'participatingUsers']
        });

        if (!space) {
            throw new Error('Space가 없습니다.');
        }

        const deleteResult = await this.userService.deleteBridge(spaceId, userId);

        if (!deleteResult) {
            throw new Error('삭제에 실패했습니다');
        }

        return true;
    }

    async deleteSpace(spaceId:number, userId:number) {
        const space = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['spaceRoles', 'participatingUsers']
        });

        if (space.ownerId != userId) {
            throw new Error('Space 소유자가 아닙니다.');
        }

        return await this.spaceRepository.delete({ id: spaceId });
    }

    async createSpaceRole(spaceId: number, userId: number, spaceRoleDto: CreateSpaceRoleDto) {
        const { role, isAdministrator } = spaceRoleDto;

        const userRole = await this.userService.getRoleOfUser(spaceId, userId);

        if (!userRole) {
            throw new Error('Space에 없는 User입니다.')
        }

        if (!userRole.isAdministrator) {
            throw new Error('관리자가 아닙니다.');
        }

        const entryCode = this.generateEntryCode();
        const spaceRoleObject = await this.spaceRoleRepository.create({
            spaceId, role, isAdministrator, entryCode
        });

        const existingRole = await this.spaceRoleRepository.exists({
            where: {
                spaceId,
                role
            }
        });
        if (existingRole) {
            throw new Error('이미 존재하는 이름의 역할입니다.');
        }

        const newRole = await this.spaceRoleRepository.save(spaceRoleObject);
        return newRole;
    }

    async deleteSpaceRole(spaceId:number, userId: number, roleId: number) {
        const userRole = await this.userService.getRoleOfUser(spaceId, userId)

        if (!userRole.isAdministrator) {
            throw new Error('관리자가 아닙니다.');
        }

        return await this.spaceRoleRepository.delete({id: roleId});
    }
}
