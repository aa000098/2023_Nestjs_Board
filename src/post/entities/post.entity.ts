import { BaseModel } from "src/common/entities/base.entity";
import { SpaceModel } from "src/space/entities/space.entity";
import { UserModel } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PostTypeEnum } from "../const/post-type.const";
import { IsBoolean, IsString } from "class-validator";
import { PostStateEnum } from "../const/post-state.const";
import { ChatModel } from "src/chat/entities/chat.entity";

@Entity({name: 'post'})
export class PostModel extends BaseModel {
    @Column()
    spaceId: number;

    @Column()
    writerId: number;

    @Column({
        type: 'enum', enum: PostTypeEnum
    })
    postType: PostTypeEnum;

    @Column()
    postTitle: string;

    @Column({
        type: 'enum', enum: PostStateEnum
    })
    postState: PostStateEnum;

    @Column()
    @IsString()
    content: string;

    @Column({
        nullable: true
    })
    image: Buffer;

    @Column({
        nullable: true
    })
    file: Buffer;

    @Column()
    @IsBoolean()
    isAnonymous: Boolean;

    @Column({default: 0})
    curiosity: number;
    
    @ManyToOne(()=> SpaceModel, (space)=> space.posts)
    @JoinColumn({name: 'spaceId', referencedColumnName: 'id'})
    space: SpaceModel;

    @ManyToOne(()=> UserModel, (user)=> user.posts)
    @JoinColumn({name: 'writerId', referencedColumnName: 'id'})
    writer: UserModel;

    @OneToMany(()=>ChatModel, (chat)=>chat.post)
    chats: ChatModel[];
}