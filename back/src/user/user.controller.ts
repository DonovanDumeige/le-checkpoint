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
  UseInterceptors,
  Post,
  UploadedFile,
  Req,
  Res,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileInterceptor } from '@nestjs/platform-express';
import { Pagination } from 'nestjs-typeorm-paginate';
import { Observable } from 'rxjs';
import { HasRoles, User } from 'src/assets/decorator';
import { UserEntity } from 'src/assets/entities';
import { JwtAuthGuard, RolesGuard } from 'src/assets/guard';
import {
  CreateUserDTO,
  Role,
  RoleUserDTO,
  UpdateUserDTO,
  UserInterface,
} from 'src/assets/models';
import { UserService } from './user.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { join } from 'path';
import { AuthGuard } from '@nestjs/passport';

export const storage = {
  storage: diskStorage({
    destination: './uploads/avatars',
    filename: (req, file, cb) => {
      const filename: string =
        // Take the orignal name of the file and delete white space if it has some
        // and generate an uuid at the end of the file.
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly config: ConfigService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.userService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get('index')
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Query('username') username: string,
  ): Observable<Pagination<UserInterface>> {
    limit = limit > 100 ? 100 : limit;

    if (username === null || username === undefined) {
      return this.userService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: `http://localhost:${this.config.get('APP_PORT')}/api/user/index`,
      });
    } else {
      return this.userService.paginateFilterByUsername(
        {
          page: Number(page),
          limit: Number(limit),
          // eslint-disable-next-line prettier/prettier
          route: `http://localhost:${this.config.get('APP_PORT')}/api/user/index`,
        },
        { username },
      );
    }
  }

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

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadFile(
    @UploadedFile() file,
    @Req() req,
    @Body() dto: UpdateUserDTO,
  ): Promise<Partial<UserEntity>> {
    const user = req.user;
    dto.profileImage = file.filename;
    const upUser = await this.userService.updateUser(user.id, user, dto);

    return upUser;
  }

  // using object response to get profile image from uploads folder.
  @Get('profile-image/:imagename')
  findProfileImage(@Param('imagename') imagename: string, @Res() res) {
    return res.sendFile(join(process.cwd(), 'uploads/avatars/' + imagename));
  }
}
