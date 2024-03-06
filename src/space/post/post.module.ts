import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { PostModel } from './entities/post.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostModel]),
    AuthModule,
    UserModule
  ],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
