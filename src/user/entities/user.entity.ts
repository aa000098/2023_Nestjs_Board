import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { SpaceUserBridgeModel } from "./space_user_bridge.entity";
import { SpaceModel } from "src/space/entities/space.entity";
import { GendersEnum } from "../const/gender.const";
import { IsEmail, IsString, MinLength } from "class-validator";

@Entity({ name: 'user' })
export class UserModel extends BaseModel {
    @Column()
    @IsEmail()
    email: string;

    @Column()
    @MinLength(6)
    password: string;

    @Column()
    @IsString()
    userName: string;

    @OneToMany(() => SpaceModel, (space)=> space.owner)
    owningSpaces: SpaceModel[];

    @OneToMany(()=> SpaceUserBridgeModel, (bridge)=> bridge.participatingUsers)
    participatingSpaces: SpaceUserBridgeModel[];

    @Column({
        nullable: true,
    })
    profileImage: Buffer;

    @Column({type: 'enum', enum: GendersEnum })
    gender: GendersEnum;
}