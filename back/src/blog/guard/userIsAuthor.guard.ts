import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Role } from 'src/assets/models';
import { BlogService } from 'src/blog/blog.service';
import { UserService } from 'src/user/user.service';

// guard alternatif qui fonctionne comme la méthode isOwnerOrAdmin
@Injectable()
export class UserIsAuthor implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    @Inject(forwardRef(() => BlogService))
    private blogService: BlogService,
  ) {}

  /**
   * Verifie que l'id de l'user et celui de l'article soit les mêmes sauf si le role est
   * admin ou chiefeditor
   *
   * Si ce n'est pas le cas, renvoie faux.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    let hasPermission = false;
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const articleID = Number(params.id);
    const user = request.user;

    const findUser = await this.userService.findOne(user.id);
    const findArticle = await this.blogService.findOnebyID(articleID);
    if (
      findUser.role === Role.ADMIN ||
      findUser.role === Role.CHIEFEDITOR ||
      findUser.id === findArticle.author.id
    ) {
      hasPermission = true;
    }

    return findUser && hasPermission;
  }
}
