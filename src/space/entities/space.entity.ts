import { IsString } from "class-validator";
import { BaseModel } from "src/common/entities/base.entity";
import { SpaceUserBridgeModel } from "src/user/entities/space_user_bridge.entity";
import { UserModel } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { SpaceRoleModel } from "./space-role.entity";
import { PostModel } from "src/space/post/entities/post.entity";

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

    @OneToMany(()=> SpaceRoleModel, (spaceRole)=> spaceRole.space, {
        cascade: true,
    })
    spaceRoles: SpaceRoleModel[];

    @OneToMany(()=> PostModel, (post)=> post.space, {
        cascade: true
    })
    posts: PostModel[];


} 