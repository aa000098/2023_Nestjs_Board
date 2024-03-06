import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { RoleService } from './role.service';
import { AccessTokenGuard } from 'src/auth/guard/bearer_token.guard';
import { UserModel } from 'src/user/entities/user.entity';
import { User } from 'src/user/decorator/user.decorator';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('space/:spaceId/role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  getRoles(
    @Param('spaceId', ParseIntPipe) spaceId: number,
  ) {
    return this.roleService.getRoles(spaceId);
  }

  @Post()
  @UseGuards(AccessTokenGuard)
  createRole(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
    @Body() body: CreateRoleDto,
  ) {
    return this.roleService.createNewRole(spaceId, user.id, body);
  }

  @Patch(':roleId')
  @UseGuards(AccessTokenGuard)
  patchRole(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
    @Param('roleId', ParseIntPipe) roleId: number,
    @Body() body: UpdateRoleDto,
  ) {
    return this.roleService.updateRole(spaceId, user.id, roleId, body);
  }

  @Delete(':roleId')
  @UseGuards(AccessTokenGuard)
  deleteRole(
    @Param('spaceId', ParseIntPipe) spaceId: number,
    @User() user: UserModel,
    @Param('roleId', ParseIntPipe) roleId: number,
  ) {
    return this.roleService.deleteRole(spaceId, user.id, roleId);
  }

}
