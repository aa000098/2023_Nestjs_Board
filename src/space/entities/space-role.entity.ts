import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { SpaceModel } from "./space.entity";
import { IsAlphanumeric, IsBoolean, IsString } from "class-validator";
import { SpaceUserBridgeModel } from "src/user/entities/space_user_bridge.entity";

@Entity({name: 'space_role' })
export class SpaceRoleModel extends BaseModel {
    @Column()
    spaceId: number;

    @ManyToOne(()=> SpaceModel, (space)=> space.spaceRoles, {onDelete: "CASCADE"})
    @JoinColumn({name: 'spaceId', referencedColumnName: 'id'})
    space: SpaceModel;

    @Column()
    @IsString()
    role: string;

    @Column()
    @IsBoolean()
    isAdministrator: boolean;

    @Column({length: 8, unique: true})
    @IsAlphanumeric()
    entryCode: string;

    @OneToOne(()=>SpaceUserBridgeModel, (bridge)=> bridge.spaceRole)
    bridge: SpaceRoleModel;
}