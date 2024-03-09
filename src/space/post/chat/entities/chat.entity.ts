import { IsBoolean, IsNumber, IsString } from "class-validator";
import { BaseModel } from "src/common/entities/base.entity";
import { PostModel } from "src/space/post/entities/post.entity";
import { UserModel } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";

@Entity({name: 'chat'})
export class ChatModel extends BaseModel {
    @Column()
    postId: number;

    @Column()
    writerId: number | null;

    @Column()
    @IsString()
    content: string;

    @Column({
        nullable: true
    })
    parentId: number | null;

    @Column()
    @IsBoolean()
    isAnonymous: Boolean;

    @Column({default: 0})
    @IsNumber()
    likeCount: number;

    @ManyToOne(()=> PostModel, (post)=> post.chats, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'postId', referencedColumnName: 'id'})
    post: PostModel;

    @ManyToOne(()=> UserModel, (user)=> user.chats, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'writerId', referencedColumnName: 'id'})
    writer: UserModel | null;

    @ManyToOne(()=> ChatModel, (chat)=> chat.children, {onDelete: 'CASCADE', nullable: true})
    @JoinColumn({name: 'parentId', referencedColumnName: 'id'})
    parent: ChatModel | null;

    @OneToMany(()=> ChatModel, (chat)=> chat.parent)
    children: ChatModel[];

    get _writerId(): number | null {
        return this.isAnonymous ? null : this.writerId;
    }

    get _writer(): UserModel | null {
        return this.isAnonymous ? 
        null : 
        {
            ...this.writer,
            email: null,
            password: null
        };
    }
}