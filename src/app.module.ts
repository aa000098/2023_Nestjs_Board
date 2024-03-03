import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpaceModule } from './space/space.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpaceModel } from './space/entities/space.entity';
import { ConfigModule } from '@nestjs/config';
import { ENV_DB_DATABASE_KEY, ENV_DB_HOST_KEY, ENV_DB_PASSWORD_KEY, ENV_DB_PORT_KEY, ENV_DB_USERNAME_KEY } from './common/const/env-keys.const';
import { UserModule } from './user/user.module';
import { UserModel } from './user/entities/user.entity';
import { SpaceUserBridgeModel } from './user/entities/space_user_bridge.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.dev.env',
      isGlobal: true,
    }),
    TypeOrmModule.forFeature([
      UserModel,
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env[ENV_DB_HOST_KEY],
      port: +process.env[ENV_DB_PORT_KEY],
      username: process.env[ENV_DB_USERNAME_KEY],
      password: process.env[ENV_DB_PASSWORD_KEY],
      database: process.env[ENV_DB_DATABASE_KEY],
      logging: true,
      entities: [
        SpaceModel,
        UserModel,
        SpaceUserBridgeModel,
      ],
      synchronize: true,

    }),
    SpaceModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
