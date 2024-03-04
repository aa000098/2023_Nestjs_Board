import { IsString } from "class-validator";
import { BaseModel } from "src/common/entities/base.entity";
import { SpaceUserBridgeModel } from "src/user/entities/space_user_bridge.entity";
import { UserModel } from "src/user/entities/user.entity";
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryColumn } from "typeorm";
import { SpaceRoleModel } from "./space-role.entity";

@Entity({ name: 'space' })
export class SpaceModel extends BaseModel {
    @Column()
    @IsString()
    spaceName: string;

    @Column()
    ownerId: number;

    @ManyToOne(()=> UserModel, (user)=> user.owningSpaces, {
        nullable:false,
    })
    @JoinColumn({name: 'ownerId', referencedColumnName: 'id'})
    owner: UserModel;

    @OneToMany(()=> SpaceUserBridgeModel, (bridge)=> bridge.participatingSpaces)
    participatingUsers: SpaceUserBridgeModel[];

    @OneToMany(()=> SpaceRoleModel, (spaceRole)=> spaceRole.space, {
        cascade: true,
    })
    spaceRole: SpaceRoleModel[];

    @Column({
        nullable: true,
    })
    spaceLogo: Buffer;
} 