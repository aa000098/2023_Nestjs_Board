import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModel } from './entities/role.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([RoleModel]),
    UserModule,
    AuthModule,
  ],
  exports: [
    RoleService,
  ],
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
