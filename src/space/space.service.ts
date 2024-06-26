import { Repository } from 'typeorm';
import { SpaceModel } from './entities/space.entity';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { RoleService } from './role/role.service';
import { CreateSpaceDto } from './dto/create-space.dto';
import { RoleEnum } from './role/const/role.const';
import { LOGO_FOLDER_PATH, TEMP_FOLDER_PATH } from 'src/common/const/path.const';
import { basename, join } from 'path';
import {promises} from 'fs';

@Injectable()
export class SpaceService {
    constructor(
        @InjectRepository(SpaceModel)
        private readonly spaceRepository: Repository<SpaceModel>,
        private readonly userService: UserService,
        private readonly roleService: RoleService,
    ) { }

    async getAllSpaces() {
        const spaces = await this.spaceRepository.find({
            relations: ['participatingUsers']
        });
        return spaces
    }

    async createSpaceLogo(spaceDto: CreateSpaceDto) {
        const tempFilePath = join(TEMP_FOLDER_PATH,spaceDto.spaceLogo);

        try {
            await promises.access(tempFilePath);
        } catch (e) {
            throw new BadRequestException('존재하지 않는 파일 입니다.');
        }

        const fileName = basename(tempFilePath);
        const newPath = join(LOGO_FOLDER_PATH, fileName);

        await promises.rename(tempFilePath, newPath);

        return true; 
    }

    async createSpace(ownerId: number, spaceDto: CreateSpaceDto) {
        const { spaceName, spaceLogo, roles } = spaceDto;

        const newSpace = await this.spaceRepository.save({
            ownerId,
            spaceName,
            spaceLogo,
        });

        const spaceId = newSpace.id;

        const ownerRole = await this.roleService.createDefaultRole(spaceId);
        await this.addUserToSpace(spaceId, ownerId, ownerRole.entryCode);

        if (typeof roles ==='undefined') {
            throw new BadRequestException('역할 세트를 지정해주세요.');
        }

        for (const roleDto of roles) {
            await this.roleService.createNewRole(spaceId, roleDto);
        };

        const space = this.spaceRepository.findOne({
            where: {
                id: spaceId,
            },
            relations: ['roles', 'participatingUsers']
        });

        this.createSpaceLogo(spaceDto);

        return space;
    }

    async addUserToSpace(spaceId: number, userId: number, entryCode: string) {
        const space = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['roles', 'participatingUsers']
        });

        const roles = space.roles;
        const role = roles.find((role) => {
            return role.entryCode == entryCode;
        });

        if (!role) {
            throw new BadRequestException('입장 코드가 틀렸습니다.')
        }

        const bridge = await this.userService.createBridge(spaceId, userId, role);

        if (!bridge) {
            throw new BadRequestException('이미 존재하는 유저입니다.');
        }

        const updatedSpace = await this.spaceRepository.findOne({
            where: {
                id: spaceId
            },
            relations: ['participatingUsers']
        });
        return updatedSpace;
    }

    async deleteUserFromSpace(spaceId, userId) {
        const role = await this.userService.getRoleOfUser(spaceId, userId);

        if (role.authority == RoleEnum.OWNER) {
            throw new BadRequestException('소유자는 탈퇴할 수 없습니다.');
        }

        const deleteResult = await this.userService.deleteBridge(spaceId, userId);

        if (!deleteResult) {
            throw new BadRequestException('존재하지 않는 User입니다.');
        }

        return deleteResult;
    }

    async deleteSpace(spaceId:number) {
        return await this.spaceRepository.delete({ id: spaceId });
    }

    async checkSpaceExistsById(id: number) {
        return await this.spaceRepository.exists({
            where: {
                id,
            }
        });
    }
}
