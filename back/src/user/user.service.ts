import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { UserEntity } from 'src/assets/entities';
import { Role, RoleUserDTO, UpdateUserDTO } from 'src/assets/models';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userDB: Repository<UserEntity>,
  ) {}

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userDB.findOneBy({ id });
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
      throw new ForbiddenException('acces unauthorized');
    }
  }

  async deleteUser(id: number, user): Promise<string> {
    const findUser = await this.userDB.findOneBy({ id });
    if (this.isOwnerOrAdmin(findUser, user)) {
      await this.userDB.delete(id);
      return `User n°${id} deleted.`;
    } else {
      throw new ForbiddenException('acces unauthorized');
    }
  }

  async updateRoleUser(
    id: number,
    role: RoleUserDTO,
  ): Promise<{ id: number; role: Role }> {
    const user = await this.userDB.findOneOrFail({ where: { id } });
    console.log('Role: ', role);
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

  async paginate(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    const queryBuilder = await this.userDB
      .createQueryBuilder('user')
      .select([
        'user.id',
        'user.name',
        'user.username',
        'user.email',
        'user.role',
      ]);
    queryBuilder.orderBy('user.username', 'ASC');
    return paginate<UserEntity>(queryBuilder, options);
  }
}
