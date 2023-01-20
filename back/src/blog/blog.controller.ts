import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  Response,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { HasRoles, User } from 'src/assets/decorator';
import { JwtAuthGuard, RolesGuard } from 'src/assets/guard';
import { CreateArticleDTO, Role } from 'src/assets/models';
import { BlogService } from './blog.service';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
import { use } from 'passport';
import { EditArticleDTO } from 'src/assets/models/dto/blog/editArticle.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

export const url = 'http://localhost:3000/blog';

export const storage = {
  storage: diskStorage({
    destination: './uploads/blog-header-images',
    filename: (req, file, cb) => {
      const filename: string =
        path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
      const extension: string = path.parse(file.originalname).ext;

      cb(null, `${filename}${extension}`);
    },
  }),
};
@Controller('blog')
export class BlogController {
  constructor(private blogService: BlogService) {}

  @HasRoles(Role.EDITOR || Role.CHIEFEDITOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  createArticle(@Body() data: CreateArticleDTO, @User() user) {
    return this.blogService.createArticle(data, user);
  }

  @Get()
  findAll() {
    return this.blogService.findAll();
  }

  @Get('index')
  index(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
  ) {
    limit = limit > 100 ? 100 : limit;
    return this.blogService.paginateAll({
      limit: limit,
      page: page,
      route: url,
    });
  }

  @Get('user/:user')
  indexByUser(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
    @Param('user') userID: number,
  ) {
    limit = limit > 100 ? 100 : limit;

    return this.blogService.paginateByAuthor(userID, {
      limit: limit,
      page: page,
      route: url + '/user/' + userID,
    });
  }

  @HasRoles(Role.CHIEFEDITOR, Role.EDITOR, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Put(':id')
  updateOneArticle(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: EditArticleDTO,
    @User() user,
  ) {
    return this.blogService.editArticle(id, data, user);
  }

  @HasRoles(Role.CHIEFEDITOR, Role.EDITOR, Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Delete(':id')
  deleteOneArticle(@Param('id', ParseIntPipe) id: number, @User() user) {
    return this.blogService.deleteOneArticle(id, user);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.blogService.findOnebyID(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/image/upload')
  @UseInterceptors(FileInterceptor('file', storage))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file,
    @User() user,
    @Body() data: EditArticleDTO,
  ) {
    data.headerImage = file.filename;
    const upArticle = await this.blogService.editArticle(id, data, user);
    return upArticle;
  }

  @Get('image/:imagename')
  findImage(@Param('imagename') imagename, @Response() res) {
    return res.sendFile(
      // res.sendFile() permet de transférer un fichier au chemin donné.
      //process.cwd() retourne le repertoire de travail actuel
      join(process.cwd(), 'uploads/blog-header-images/' + imagename),
    );
  }
}
