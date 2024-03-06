import { BaseModel } from "src/common/entities/base.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { IsAlphanumeric, IsBoolean, IsString } from "class-validator";
import { SpaceUserBridgeModel } from "src/user/entities/space_user_bridge.entity";
import { SpaceModel } from "src/space/entities/space.entity";

@Entity({name: 'role' })
export class RoleModel extends BaseModel {
    @Column()
    spaceId: number;

    @ManyToOne(()=> SpaceModel, (space)=> space.roles, {onDelete: "CASCADE"})
    @JoinColumn({name: 'spaceId', referencedColumnName: 'id'})
    space: SpaceModel;

    @Column()
    @IsString()
    roleName: string;

    @Column()
    @IsBoolean()
    isAdministrator: boolean;

    @Column({length: 8, unique: true})
    @IsAlphanumeric()
    entryCode: string;

    @OneToOne(()=>SpaceUserBridgeModel, (bridge)=> bridge.role)
    bridge: RoleModel;
}