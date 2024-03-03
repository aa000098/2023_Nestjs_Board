import { SpaceModel } from "src/space/entities/space.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";
import { UserModel } from "./user.entity";

@Entity({ name: 'space_user_bridge' })
export class SpaceUserBridgeModel {
    @PrimaryColumn()
    spaceId: number;

    @PrimaryColumn()
    userId: number;

    @ManyToOne(()=> SpaceModel, (space)=> space.participatingUsers)
    @JoinColumn({name: 'spaceId', referencedColumnName: 'id'})
    participatingSpaces: SpaceModel;
    
    @ManyToOne(()=> UserModel, (user)=> user.participatingSpaces)
    @JoinColumn({name: 'userId', referencedColumnName: 'id'})
    participatingUsers: UserModel;

    @Column()
    role: string;
} 