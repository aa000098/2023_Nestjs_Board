import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserModel } from './entities/user.entity';
import { GendersEnum } from './const/gender.const';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserModel)
        private readonly userRepository: Repository<UserModel>,
        ) {}
    
    async getAllUsers() {
        const users = this.userRepository.find();
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

    async createUser(userDto: CreateUserDto) {
        const emailExists = await this.userRepository.exists({
            where: {
                email: userDto.email,
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

    async updateUser(email, userDto: UpdateUserDto) {
        const {password, profileImage} = userDto;

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

}
