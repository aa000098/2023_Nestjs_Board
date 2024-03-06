import { IsString } from "class-validator";
import { BaseModel } from "src/common/entities/base.entity";
import { SpaceUserBridgeModel } from "src/user/entities/space_user_bridge.entity";
import { UserModel } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { PostModel } from "src/space/post/entities/post.entity";
import { RoleModel } from "../role/entities/role.entity";

@Entity({ name: 'space' })
export class SpaceModel extends BaseModel {
    @Column()
    @IsString()
    spaceName: string;

    @Column()
    ownerId: number;
    
    @Column({
        nullable: true,
    })
    spaceLogo: Buffer;

    @ManyToOne(()=> UserModel, (user)=> user.owningSpaces, {
        nullable:false,
        onDelete: 'CASCADE'
    })
    @JoinColumn({name: 'ownerId', referencedColumnName: 'id'})
    owner: UserModel;

    @OneToMany(()=> SpaceUserBridgeModel, (bridge)=> bridge.participatingSpaces)
    participatingUsers: SpaceUserBridgeModel[];

    @OneToMany(()=> RoleModel, (spaceRole)=> spaceRole.space, {
        cascade: true,
    })
    roles: RoleModel[];

    @OneToMany(()=> PostModel, (post)=> post.space, {
        cascade: true
    })
    posts: PostModel[];


} 