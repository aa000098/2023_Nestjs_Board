import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { UserModel } from 'src/user/entities/user.entity';
import { User } from 'src/user/decorator/user.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './decorator/role.decorator';
import { RoleEnum } from './const/role.const';
import { RoleModel } from './entities/role.entity';

@Controller('space/:spaceId/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @Role(RoleEnum.OWNER, RoleEnum.ADMIN)
  getRoles(
    @Param('spaceId', ParseIntPipe) spaceId: number,
  ) {
    return this.roleService.getRoles(spaceId);
  }

  @Post()
  @Role(RoleEnum.OWNER, RoleEnum.ADMIN)
  createRole(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Body() body: CreateRoleDto,
  ) {
    return this.roleService.createNewRole(spaceId, body);
  }

  @Patch(':roleId')
  @Role(RoleEnum.OWNER, RoleEnum.ADMIN)
  patchRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() body: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(roleId, body);
  }

  @Patch(':roleId/:userId')
  @Role(RoleEnum.OWNER, RoleEnum.ADMIN)
  patchUserRole(
    @Param('roleId', ParseIntPipe) roleId: number,
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Req() req: any,
  ) {
    return this.roleService.updateUserRole(spaceId, roleId, userId, req.userRole.authority);
  }

  @Delete(':roleId')
  @Role(RoleEnum.OWNER, RoleEnum.ADMIN)
  deleteRole(
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.roleService.deleteRole(roleId);
  }

}
