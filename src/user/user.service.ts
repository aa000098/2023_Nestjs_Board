import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './entities/user.entity';
import { SpaceUserBridgeModel } from './entities/space_user_bridge.entity';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { CreateRoleDto } from 'src/space/role/dto/create-role.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserModel)
        private readonly userRepository: Repository<UserModel>,

        @InjectRepository(SpaceUserBridgeModel)
        private readonly bridgeRepository: Repository<SpaceUserBridgeModel>,
    ) { }

    async getAllUsers() {
        const users = this.userRepository.find({
            select: ['id', 'createdAt', 'updatedAt', 'gender', 'userName', 'profileImage'],
            relations: ['participatingSpaces', 'owningSpaces']
        });
        return users;
    }

    async getUserById(userId, viewerId) {
        const isMyProfile = userId==viewerId;
        const user = this.userRepository.findOne({
            select: isMyProfile ? undefined : ['id', 'createdAt', 'updatedAt', 'gender', 'userName', 'profileImage'],
            where: {
                id: userId,
            },
            relations: isMyProfile ? ['chats', 'posts', 'owningSpaces','participatingSpaces'] : ['owningSpaces','participatingSpaces']
        })
        return user;
    }

    async getUserByEmail(email: string) {
        const user = this.userRepository.findOne({
            where: {
                email,
            },
        });
        return user;
    }

    async createUser(userDto: RegisterUserDto) {
        const {email} = userDto;
        const emailExists = await this.userRepository.exists({
            where: {
                email,
            }
        });

        if (emailExists) {
            throw new BadRequestException('이미 존재하는 email 입니다.');
        }

        const userObject = await this.userRepository.create({
            ...userDto
        });
        const newUser = await this.userRepository.save(userObject);
        return newUser;
    }

    async updateUser(user: UserModel, userDto: UpdateUserDto) {
        const updatedUser = this.userRepository.create({
            ...user,
            ...userDto,
        });

        const savedUser = await this.userRepository.save(updatedUser);
        return savedUser;
    }

    async deleteUser(userId: number) {
        if (!userId) {
            throw new UnauthorizedException('유저 정보가 없습니다.');
        }

        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user) throw new NotFoundException();

        return await this.userRepository.delete(user.id);
    }

    async createBridge(spaceId: number, userId: number, role: CreateRoleDto) {
        const existingBridge = await this.bridgeRepository.exists({
            where: {
                spaceId,
                userId
            }
        });

        if (existingBridge) {
            return null;
        }

        const bridgeObject = await this.bridgeRepository.create({
            spaceId,
            userId,
            role
        });

        const newBridge = await this.bridgeRepository.save(bridgeObject);
        return newBridge;
    }

    async deleteBridge(spaceId: number, userId: number) {
        const existingBridge = await this.bridgeRepository.exists({
            where: {
                spaceId,
                userId
            }
        });

        if (!existingBridge) {
            return false;
        }
        
        return await this.bridgeRepository.delete({
                spaceId, userId
            });
        }

        async getRoleOfUser(spaceId: number, userId: number) {
            const bridge = await this.bridgeRepository.findOne({
                where: {
                    spaceId,
                    userId
                }
            });
            if (!bridge) {
                return null
            }
            return bridge.role;
        }

        async isRoleInUse(roleId: number) {
            const result = await this.bridgeRepository.exists({
                where: {
                    roleId,
                }
            })
            return result;
        }
}
