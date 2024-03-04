import { Repository } from 'typeorm';
import { SpaceModel } from './entities/space.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SpaceRoleModel } from './entities/space-role.entity';
import { CreateSpaceDto } from './dto/create-space.dto';
import { UserService } from 'src/user/user.service';
import { CreateSpaceRoleDto } from './dto/create-space-role.dto';
import { SpaceUserDto } from './dto/space-user.dto';

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
            relations: ['owner', 'spaceRole', 'participatingUsers']
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

    async createSpace(email, spaceDto: CreateSpaceDto) {
        const { spaceName, spaceLogo, spaceRoles } = spaceDto;
        const ownerUser = await this.userService.getUserByEmail(email);
        const spaceObject = await this.spaceRepository.create({
            owner: ownerUser,
            spaceName,
            spaceLogo,
        });

        const newSpace = await this.spaceRepository.save(spaceObject);

        const spaceId = newSpace.id;

        const ownerEntryCode = this.generateEntryCode();
        const roleObject = await this.spaceRoleRepository.create({
            spaceId, role: '소유자', isAdministrator: true, entryCode: ownerEntryCode
        });
        await this.spaceRoleRepository.save(roleObject);

        for (const spaceRoleDto of spaceRoles) {
            const { role, isAdministrator } = spaceRoleDto;
            const entryCode = this.generateEntryCode();
            const spaceRoleObject = await this.spaceRoleRepository.create({
                spaceId, role, isAdministrator, entryCode
            });
            await this.spaceRoleRepository.save(spaceRoleObject);
        };

        const space = this.addUserToSpace({ spaceId, email }, ownerEntryCode);

        return space;
    }

    async getAllSpaceRole() {
        return this.spaceRoleRepository.find();
    }

    async addUserToSpace(spaceUserDto: SpaceUserDto, entryCode) {
        const { spaceId, email } = spaceUserDto;
        const space = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['spaceRole', 'participatingUsers']
        });
        const user = await this.userService.getUserByEmail(email);
        const userId = user.id;

        if (!space || !user) {
            throw new Error('Space 또는 User가 없습니다.')
        }

        const spaceRoles = space.spaceRole;
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
            relations: ['spaceRole', 'participatingUsers']
        });
        return updatedSpace;
    }

    async deleteUserFromSpace(spaceUserDto: SpaceUserDto) {
        const { spaceId, email } = spaceUserDto;
        const space = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['spaceRole', 'participatingUsers']
        });
        const user = await this.userService.getUserByEmail(email);
        const userId = user.id;

        if (!space || !user) {
            throw new Error('Space 또는 User가 없습니다.')
        }

        const deleteResult = await this.userService.deleteBridge(spaceId, userId);

        if (!deleteResult) {
            throw new Error('삭제에 실패했습니다');
        }

        return true;
    }

    async deleteSpace(userSpaceDto) {
        const { spaceId, email } = userSpaceDto;
        const space = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['spaceRole', 'participatingUsers']
        });

        if (!space) {
            throw new Error('Space가 없습니다.');
        }

        const user = await this.userService.getUserByEmail(email);
        const userId = user.id;

        if (!user) {
            throw new Error('User가 없습니다.');
        }

        if (space.ownerId != userId) {
            throw new Error('Space 소유자가 아닙니다.');
        }

        return await this.spaceRepository.delete({ id: spaceId });
    }

    async createSpaceRole(email, spaceRoleDto: CreateSpaceRoleDto) {
        const { spaceId, role, isAdministrator } = spaceRoleDto;
        const space = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['spaceRole', 'participatingUsers']
        });

        if (!space) {
            throw new Error('Space가 없습니다.');
        }

        const user = await this.userService.getUserByEmail(email);
        const userId = user.id;

        if (!user) {
            throw new Error('User가 없습니다.');
        }

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

    async deleteSpaceRole(body) {
        const {spaceId, roleId} = body;
        return await this.spaceRoleRepository.delete({id: roleId});
    }
}
