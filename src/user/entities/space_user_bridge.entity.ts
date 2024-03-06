import { SpaceModel } from "src/space/entities/space.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { UserModel } from "./user.entity";
import { RoleModel } from "src/space/role/entities/role.entity";
import { IsNumber } from "class-validator";

@Entity({ name: 'space_user_bridge' })
export class SpaceUserBridgeModel {
    @PrimaryColumn()
    @IsNumber()
    spaceId: number;

    @PrimaryColumn()
    @IsNumber()
    userId: number;

    @Column()
    @IsNumber()
    roleId: number;

    @ManyToOne(()=> SpaceModel, (space)=> space.participatingUsers, { onDelete: "CASCADE"})
    @JoinColumn({name: 'spaceId', referencedColumnName: 'id'})
    participatingSpaces: SpaceModel;
    
    @ManyToOne(()=> UserModel, (user)=> user.participatingSpaces, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId', referencedColumnName: 'id'})
    participatingUsers: UserModel;

    @ManyToOne(()=> RoleModel, {eager: true} )
    @JoinColumn({name: 'roleId', referencedColumnName: 'id'})
    role: RoleModel;
} 