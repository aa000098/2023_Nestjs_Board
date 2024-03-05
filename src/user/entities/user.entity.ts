import { BaseModel } from "src/common/entities/base.entity";
import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { SpaceUserBridgeModel } from "./space_user_bridge.entity";
import { SpaceModel } from "src/space/entities/space.entity";
import { GendersEnum } from "../const/gender.const";
import { IsEmail, IsString, Length } from "class-validator";
import { Exclude } from "class-transformer";
import { PostModel } from "src/post/entities/post.entity";
import { ChatModel } from "src/chat/entities/chat.entity";

@Entity({ name: 'user' })
export class UserModel extends BaseModel {
    @Column({
        unique: true,
    })
    @IsEmail()
    email: string;

    @Column()
    @Exclude()
    @Length(6)
    password: string;

    @Column()
    @IsString()
    userName: string;

    @Column({
        nullable: true,
    })
    profileImage: Buffer;

    @Column({type: 'enum', enum: GendersEnum })
    gender: GendersEnum;

    @OneToMany(() => SpaceModel, (space)=> space.owner)
    owningSpaces: SpaceModel[];

    @OneToMany(()=> SpaceUserBridgeModel, (bridge)=> bridge.participatingUsers)
    participatingSpaces: SpaceUserBridgeModel[];

    @OneToMany(()=> PostModel, (post)=> post.writer)
    posts: PostModel[];

    @OneToMany(()=> ChatModel, (chat)=> chat.user)
    chats: ChatModel[];
}