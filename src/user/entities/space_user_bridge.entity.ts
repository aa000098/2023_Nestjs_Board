import { SpaceModel } from "src/space/entities/space.entity";
import { Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { UserModel } from "./user.entity";
import { SpaceRoleModel } from "src/space/entities/space-role.entity";

@Entity({ name: 'space_user_bridge' })
export class SpaceUserBridgeModel {
    @PrimaryColumn()
    spaceId: number;

    @PrimaryColumn()
    userId: number;

    @ManyToOne(()=> SpaceModel, (space)=> space.participatingUsers, { onDelete: "CASCADE"})
    @JoinColumn({name: 'spaceId', referencedColumnName: 'id'})
    participatingSpaces: SpaceModel;
    
    @ManyToOne(()=> UserModel, (user)=> user.participatingSpaces, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId', referencedColumnName: 'id'})
    participatingUsers: UserModel;

    @OneToOne(()=> SpaceRoleModel, {eager: true} )
    @JoinColumn()
    spaceRole: SpaceRoleModel;
} 