import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Put,
  UseGuards,
} from '@nestjs/common';
import { HasRoles, User } from 'src/assets/decorator';
import { UserEntity } from 'src/assets/entities';
import { JwtAuthGuard, RolesGuard } from 'src/assets/guard';
import { Role, UpdateUserDTO } from 'src/assets/models';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  // Le role et le role guard permet d'autoriser
  //l'accès à la route à un utilisateur authentifié, si il a le rôle souhaité.
  @HasRoles(Role.ADMIN)
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @HasRoles(Role.ADMIN || Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDTO,
  ): Promise<Partial<UserEntity>> {
    return this.userService.updateUser(id, user);
  }

  @HasRoles(Role.ADMIN || Role.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteOne(
    @Param('id', ParseIntPipe) id: number,
    @User() user,
  ): Promise<string> {
    return this.userService.deleteUser(id, user);
  }
}
