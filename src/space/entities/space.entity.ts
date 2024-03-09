import { IsString } from "class-validator";
import { BaseModel } from "src/common/entities/base.entity";
import { SpaceUserBridgeModel } from "src/user/entities/space_user_bridge.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { PostModel } from "src/space/post/entities/post.entity";
import { RoleModel } from "../role/entities/role.entity";
import { Transform } from "class-transformer";
import { join } from "path";
import { LOGO_FOLDER_NAME, PUBLIC_FOLDER_NAME } from "src/common/const/path.const";

@Entity({ name: 'space' })
export class SpaceModel extends BaseModel {
    @Column()
    @IsString()
    spaceName: string;

    @Column({
        nullable: true,
    })
    @Transform(({value})=> value && `/${join(PUBLIC_FOLDER_NAME,LOGO_FOLDER_NAME,value)}`)
    spaceLogo: string;

    @OneToMany(()=> SpaceUserBridgeModel, (bridge)=> bridge.participatingSpaces)
    participatingUsers: SpaceUserBridgeModel[];

    @OneToMany(()=> RoleModel, (role)=> role.space, {
        cascade: true,
    })
    roles: RoleModel[];

    @OneToMany(()=> PostModel, (post)=> post.space, {
        cascade: true
    })
    posts: PostModel[];
} 