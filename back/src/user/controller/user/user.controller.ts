import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { CreateUserDTO } from 'src/user/models/createUser.dto';
import { UpdateUserDTO } from 'src/user/models/updateUser.dto';
import { UserEntity } from 'src/user/models/user.entity';
import { UserService } from 'src/user/service/user/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() user: CreateUserDTO): Promise<UserEntity> {
    return this.userService.create(user);
  }

  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    return this.userService.findOne(id);
  }

  @Put(':id')
  updateOne(
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDTO,
  ): Promise<Partial<UserEntity>> {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  deleteOne(@Param('id', ParseIntPipe) id: number): Promise<string> {
    return this.userService.deleteUser(id);
  }
}
