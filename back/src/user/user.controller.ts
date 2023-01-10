import {
  Controller,
  Body,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
  Patch,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pagination } from 'nestjs-typeorm-paginate';
import { HasRoles, User } from 'src/assets/decorator';
import { UserEntity } from 'src/assets/entities';
import { JwtAuthGuard, RolesGuard } from 'src/assets/guard';
import { Role, RoleUserDTO, UpdateUserDTO } from 'src/assets/models';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  // Le role et le role guard permet d'autoriser
  //l'accès à la route à un utilisateur authentifié, si il a le rôle souhaité.
  @HasRoles(Role.ADMIN)
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get('index')
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ): Promise<Pagination<UserEntity>> {
    limit = limit > 100 ? 100 : limit;
    return this.userService.paginate({
      page,
      limit,
      route: `http://localhost:${this.config.get('APP_PORT')}/user/index`,
    });
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @HasRoles(Role.USER, Role.EDITOR, Role.CHIEFEDITOR, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user,
  ): Promise<string> {
    return this.userService.deleteUser(id, user);
  }

  @HasRoles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch(':id/role')
  updateRoleUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() role: RoleUserDTO,
  ): Promise<{ id: number; role: Role }> {
    return this.userService.updateRoleUser(id, role);
  }

  @HasRoles(Role.USER, Role.EDITOR, Role.CHIEFEDITOR, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserDTO,
    @User() user,
  ): Promise<Partial<UserEntity>> {
    return this.userService.updateUser(id, user, dto);
  }
}
