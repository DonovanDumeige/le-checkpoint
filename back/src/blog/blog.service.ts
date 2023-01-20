import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/assets/decorator';
import { BlogEntity, UserEntity } from 'src/assets/entities';
import { CreateArticleDTO, Role } from 'src/assets/models';
import { Repository } from 'typeorm';
import slugify from 'slugify';
import {
  IPaginationOptions,
  paginate,
  paginateRawAndEntities,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { use } from 'passport';
import { EditArticleDTO } from 'src/assets/models/dto/blog/editArticle.dto';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(BlogEntity)
    private blogDB: Repository<BlogEntity>,
  ) {}

  // CRUD
  async createArticle(data: CreateArticleDTO, user): Promise<BlogEntity> {
    const slug = this.generateSlug(data.title);
    const article = this.blogDB.create({ slug, ...data });

    article.author = user;
    this.deleteData(article);

    return await this.blogDB.save(article);
  }

  async findOnebyID(id: number) {
    const article = await this.blogDB.findOneBy({ id });
    this.deleteData(article);
    return article;
  }

  async findAll() {
    const articles = await this.blogDB.find();
    articles.forEach((article) => this.deleteData(article));
  }

  async findAllByAuthor(id: number) {
    const allArticles = await this.blogDB.find({
      relations: ['author'],
      where: [{ author: { id } }],
    });
    allArticles.forEach((article) => {
      delete article.author.password;
    });

    return allArticles;
  }

  async editArticle(id: number, data: EditArticleDTO, user) {
    let slug;
    const findArticle = await this.findOnebyID(id);

    if (data.title && data.title != findArticle.title) {
      slug = this.generateSlug(data.title);
    }

    if (this.userIsAuthor(findArticle, user)) {
      const upArticle = await this.blogDB.save({
        ...findArticle,
        ...data,
        slug,
      });
      this.deleteData(upArticle);
      return upArticle;
    } else {
      throw new UnauthorizedException('Permissions insuffisantes.');
    }
  }

  async deleteOneArticle(id: number, user) {
    const article = await this.findOnebyID(id);
    if (this.userIsAuthor(article, user)) {
      await this.blogDB.delete(id);
      return `L'article n°${id} a bien été supprimé.`;
    } else {
      throw new UnauthorizedException('Permissions insuffisantes.');
    }
  }

  // Autres fonctions

  async paginateAll(options: IPaginationOptions) {
    const query = await paginate<BlogEntity>(this.blogDB, options, {
      relations: ['author'],
    });

    const items = query.items;
    items.sort();
    items.forEach((article) => this.deleteData(article));
    return query;
  }
  async paginateByAuthor(userID: number, options: IPaginationOptions) {
    const query = await paginate<BlogEntity>(this.blogDB, options, {
      relations: ['author'],
      where: [{ author: { id: userID } }],
    });

    const items = query.items;
    items.forEach((item) => this.deleteData(item));
    return query;
  }

  generateSlug(title: string) {
    return slugify(title);
  }

  userIsAuthor(objet: any, user: any): boolean {
    return (
      user.role === Role.CHIEFEDITOR ||
      user.role === Role.ADMIN ||
      (objet && objet.author.id === user.id)
    );
  }

  deleteData(objet: any): void {
    if (objet) {
      delete objet.author.password;
      delete objet.author.role;
      delete objet.author.profileImage;
    }
  }
}
