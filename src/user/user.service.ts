import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dt';
import { SpaceUserBridgeModel } from './entities/space_user_bridge.entity';
import { SpaceModel } from 'src/space/entities/space.entity';

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
            relations: ['participatingSpaces']
        });
        return users;
    }

    async getUserByEmail(email: string) {
        const user = this.userRepository.findOne({
            where: {
                email,
            },
        });
        return user;
    }

    async createUser(email, userDto: CreateUserDto) {
        const emailExists = await this.userRepository.exists({
            where: {
                email,
            }
        });

        if (emailExists) {
            throw new BadRequestException('이미 존재하는 email 입니다.');
        }

        const userObject = await this.userRepository.create({
            email,
            ...userDto
        });
        const newUser = await this.userRepository.save(userObject);
        return newUser;
    }

    async updateUser(email, userDto: UpdateUserDto) {
        const { password, profileImage } = userDto;

        const user = await this.userRepository.findOne({
            where: {
                email: email,
            },
        });

        if (!user) {
            throw new NotFoundException();
        }

        if (password) user.password = password;
        if (profileImage) user.profileImage = profileImage;

        const updatedUser = await this.userRepository.save(user);
        return updatedUser;
    }

    async deleteUser(email) {
        const user = await this.userRepository.findOne({
            where: {
                email,
            },
        });

        if (!user) throw new NotFoundException();

        await this.userRepository.delete(user.id);

        return email;
    }


    async createBridge(spaceId, userId, spaceRole) {
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
            spaceRole
        });

        const newBridge = await this.bridgeRepository.save(bridgeObject);
        return newBridge;
    }

    async deleteBridge(spaceId, userId) {
        const existingBridge = await this.bridgeRepository.exists({
            where: {
                spaceId,
                userId
            }
        });

        if (!existingBridge) {
            return false;
        }
        
        await this.bridgeRepository.delete({
                spaceId, userId
            });
            
        return true;
        }

        async getRoleOfUser(spaceId, userId) {
            const bridge = await this.bridgeRepository.findOne({
                where: {
                    spaceId,
                    userId
                }
            });
            if (!bridge) {
                return null
            }
            return bridge.spaceRole;
        }
}
