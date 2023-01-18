import {
  CanActivate,
  ExecutionContext,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

// guard alternatif qui fonctionne comme la méthode isOwnerOrAdmin
@Injectable()
export class UserIsUserGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let hasPermission = false;
    const request = context.switchToHttp().getRequest();
    const params = request.params;
    const user = request.user;

    const findUser = await this.userService.findOne(user.id);
    if (findUser.id === Number(params.id)) {
      hasPermission = true;
    }

    return findUser && hasPermission;
  }
}
