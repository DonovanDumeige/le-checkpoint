import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Like, Repository } from 'typeorm';
import * as argon from 'argon2';
import { UserEntity } from 'src/assets/entities';
import {
  CreateUserDTO,
  Role,
  RoleUserDTO,
  UpdateUserDTO,
  UserInterface,
} from 'src/assets/models';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';
import { from, map, Observable } from 'rxjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userDB: Repository<UserEntity>,
  ) {}

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userDB.findOneBy({ id });
    if (!user) throw new NotFoundException("L'utilisateur n'a pas été trouvé.");
    delete user.password;
    return user;
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userDB.find();
    users.forEach((user) => {
      delete user.password;
    });

    return users;
  }

  async updateUser(
    id: number,
    user: any,
    dto: UpdateUserDTO,
  ): Promise<Partial<UserEntity>> {
    let hash;

    const findUser = await this.userDB.findOneBy({ id });
    if (dto.password) {
      hash = await argon.hash(dto.password);
    }

    if (this.isOwnerOrAdmin(findUser, user)) {
      const upUser = await this.userDB.save({
        ...findUser,
        ...dto,
        password: hash,
      });

      // Alternative avec update
      //! Le résultat devient UpdateResult au lieu de Partial<Entity>
      // const upUser = await this.userDB.update({ id }, { ...dto });
      const { password, role, ...result } = upUser;
      return result;
    } else {
      throw new ForbiddenException('Accès interdit.Persission non accordée.');
    }
  }

  async deleteUser(id: number, user): Promise<string> {
    const findUser = await this.userDB.findOneBy({ id });
    if (this.isOwnerOrAdmin(findUser, user)) {
      await this.userDB.delete(id);
      return `User n°${id} deleted.`;
    } else {
      throw new ForbiddenException('Accès interdit.Persission non accordée.');
    }
  }

  async updateRoleUser(
    id: number,
    role: RoleUserDTO,
  ): Promise<{ id: number; role: Role }> {
    const user = await this.userDB.findOneOrFail({ where: { id } });
    try {
      const upUser = await this.userDB.save({ ...user, ...role });
      return {
        id: upUser.id,
        role: upUser.role,
      };
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('Access unauthorized.');
    }
  }

  isOwnerOrAdmin(objet: any, user: any): boolean {
    return user.role === Role.ADMIN || (objet && objet.id === user.id);
  }

  paginate(options: IPaginationOptions): Observable<Pagination<UserInterface>> {
    return from(paginate<UserInterface>(this.userDB, options)).pipe(
      map((usersPageable: Pagination<UserInterface>) => {
        usersPageable.items.forEach(function (v) {
          delete v.password;
        });
        return usersPageable;
      }),
    );
  }
  paginateFilterByUsername(
    options: IPaginationOptions,
    user: UserInterface,
  ): Observable<Pagination<UserInterface>> {
    return from(
      this.userDB.findAndCount({
        skip: 0,
        take: Number(options.limit) || 10,
        order: { id: 'ASC' },
        select: ['id', 'name', 'username', 'email', 'role'],
        where: [{ username: Like(`%${user.username}%`) }],
      }),
    ).pipe(
      map(([users, totalUsers]) => {
        const usersPageable: Pagination<UserInterface> = {
          items: users,
          links: {
            first: options.route + `?limit=${options.limit}`,
            previous: options.route + ``,
            next:
              options.route +
              `?limit=${options.limit}&page=${Number(options.page) + 1}`,
            last:
              options.route +
              `?limit=${options.limit}&page=${Math.ceil(
                totalUsers / Number(options.limit),
              )}`,
          },
          meta: {
            currentPage: Number(options.page),
            itemCount: users.length,
            itemsPerPage: Number(options.limit),
            totalItems: totalUsers,
            totalPages: Math.ceil(totalUsers / Number(options.limit)),
          },
        };
        return usersPageable;
      }),
    );
  }
}
