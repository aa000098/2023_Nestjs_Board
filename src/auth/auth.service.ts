import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HASH_ROUNDS, JWT_SECRET } from 'src/common/const/env-keys.const';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/register-user.dto';
import * as bcrypt from 'bcrypt';
import { UserModel } from 'src/user/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}    
        async registerUser(userDto: RegisterUserDto) {
            const hash = await this.hashPassword(userDto.password);

            const user = await this.userService.createUser({
                ...userDto,
                password: hash,
            });

            return user;
        }

        async authenticateWithEmailAndPassword(user: Pick<UserModel, 'email' | 'password'>) {
            const existingUser = await this.userService.getUserByEmail(user.email);
    
            if (!existingUser) {
                throw new UnauthorizedException('존재하지 않는 사용자입니다.');
            }
    
            const passOK = await bcrypt.compare(user.password, existingUser.password);

            if (!passOK) {
                throw new UnauthorizedException('비밀번호가 틀렸습니다.');
            }
    
            return existingUser;
        }

        async loginWithEmail(user: Pick<UserModel, 'email' | 'password'>) {
            const existingUser = await this.authenticateWithEmailAndPassword(user);
            return existingUser;
        }

        async hashPassword(password: string) {
            const hash = await bcrypt.hash(
                password,
                +this.configService.get(HASH_ROUNDS),
            );
            return hash;
        }

        async updateUser(user: UserModel, userDto: UpdateUserDto) {
            const hash = await this.hashPassword(userDto.password);
            userDto.password = hash;
            const updatedUser = this.userService.updateUser(user, userDto);
            return updatedUser; 
        }

        signToken(user, isRefreshToken: boolean) {
            const { email } = user;
            const payload = {
                email,
                type: isRefreshToken ? 'refresh' : 'access',
            };
    
            return this.jwtService.sign(payload, {
                secret: this.configService.get(JWT_SECRET),
                expiresIn: isRefreshToken ? '30d' : '1h',
            });
        }
    
        getToken(user) {
            return {
                accessToken: this.signToken(user, false),
                refreshToken: this.signToken(user, true),
            }
        }

        extractTokenFromHeader(header: string, isBearer: boolean) {
            const splitToken = header.split(' ');
            const prefix = isBearer ? 'Bearer' : 'Basic';
            if (splitToken.length !== 2 || splitToken[0] !== prefix) {
                throw new UnauthorizedException('잘못된 토큰');
            }
            const token = splitToken[1];
            return token;
        }
    
        decodeBasicToken(base64String: string) {
            const decoded = Buffer.from(base64String, 'base64').toString('utf-8');
    
            const split = decoded.split(':');
            if (split.length !== 2) {
                throw new UnauthorizedException('잘못된 유형의 토큰');
            }
    
            const email = split[0];
            const password = split[1];
    
            return {
                email,
                password
            }
        }
    
        verifyToken(token: string) {
            try {
                return this.jwtService.verify(token, {
                    secret: this.configService.get(JWT_SECRET),
                });
            } catch (e) {
                throw new UnauthorizedException('토큰이 만료됐거나 잘못된 토큰입니다');
            }
        }
    
        rotateToken(token: string, isRefreshToken: boolean) {
            const decoded = this.jwtService.verify(token, {
                secret: this.configService.get(JWT_SECRET),
            });
    
            if (decoded.type !== 'refresh') {
                throw new UnauthorizedException('토큰 재발급은 Refresh 토큰으로만 가능합니다');
            }
    
            return this.signToken({
                ...decoded,
            }, isRefreshToken);
        }
}
