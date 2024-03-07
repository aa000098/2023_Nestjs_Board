import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleModel } from './entities/role.entity';
import { AuthModule } from 'src/auth/auth.module';
import { RoleExistsMiddleware } from './middleware/role-exists.middleware';

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
export class RoleModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
    .apply(RoleExistsMiddleware)
    .forRoutes({path: 'space/:spaceId/role/:roleId*', method: RequestMethod.ALL})
  }
}
