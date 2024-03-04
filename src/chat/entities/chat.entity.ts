import { IsBoolean, IsNumber, IsString } from "class-validator";
import { BaseModel } from "src/common/entities/base.entity";
import { PostModel } from "src/post/entities/post.entity";
import { UserModel } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity({name: 'chat'})
export class ChatModel extends BaseModel {
    @Column()
    postId: number;

    @Column()
    writerId: number;

    @Column()
    @IsString()
    content: string;

    @Column({
        nullable: true
    })
    chatGroup: number | null;

    @Column()
    @IsBoolean()
    isAnonymous: Boolean;

    @Column({default: 0})
    @IsNumber()
    likeCount: number;

    @ManyToOne(()=> PostModel, (post)=> post.chats)
    @JoinColumn({name: 'postId', referencedColumnName: 'id'})
    post: PostModel;

    @ManyToOne(()=> UserModel, (user)=> user.chats)
    @JoinColumn({name: 'writerId', referencedColumnName: 'id'})
    user: UserModel;
}