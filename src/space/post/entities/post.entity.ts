import { BaseModel } from "src/common/entities/base.entity";
import { SpaceModel } from "src/space/entities/space.entity";
import { UserModel } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PostTypeEnum } from "../const/post-type.const";
import { IsBoolean, IsString } from "class-validator";
import { PostStateEnum } from "../const/post-state.const";
import { ChatModel } from "src/space/post/chat/entities/chat.entity";
import { Transform } from "class-transformer";
import { POST_FOLDER_NAME, PUBLIC_FOLDER_NAME } from "src/common/const/path.const";
import { join } from "path";

@Entity({name: 'post'})
export class PostModel extends BaseModel {
    @Column()
    spaceId: number;

    @Column()
    writerId: number | null;

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
    @Transform(({value}) => value && `/${join(PUBLIC_FOLDER_NAME, POST_FOLDER_NAME, value)}`)
    image: string;

    @Column({
        nullable: true
    })
    @Transform(({value}) => value && `/${join(PUBLIC_FOLDER_NAME, POST_FOLDER_NAME, value)}`)
    file: string;

    @Column()
    @IsBoolean()
    isAnonymous: Boolean;

    @Column({default: 0})
    curiosity: number;
    
    @ManyToOne(()=> SpaceModel, (space)=> space.posts, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'spaceId', referencedColumnName: 'id'})
    space: SpaceModel;

    @ManyToOne(()=> UserModel, (user)=> user.posts, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'writerId', referencedColumnName: 'id'})
    writer: UserModel | null;

    @OneToMany(()=>ChatModel, (chat)=>chat.post)
    chats: ChatModel[];

    get _writerId(): number | null {
        return this.isAnonymous ? null : this.writerId;
    }

    get _writer(): UserModel | null {
        return this.isAnonymous ? null : {
            ...this.writer,
            email: null,
            password: null
        }
    }
}