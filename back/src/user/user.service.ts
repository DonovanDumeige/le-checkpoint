import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { UserEntity } from 'src/assets/entities';
import { Role, UpdateUserDTO } from 'src/assets/models';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userDB: Repository<UserEntity>,
  ) {}

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userDB.findOneBy({ id });
    delete user.password;
    delete user.role;
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
    dto: UpdateUserDTO,
  ): Promise<Partial<UserEntity>> {
    const user = await this.userDB.findOneBy({ id });
    const hash = await argon.hash(dto.password);
    const upUser = await this.userDB.save({ ...user, ...dto, password: hash });

    // Alternative avec update
    //! Le résultat devient UpdateResult au lieu de Partial<Entity>
    // const upUser = await this.userDB.update({ id }, { ...dto });
    const { password, role, ...result } = upUser;
    return result;
  }

  async deleteUser(id: number, user): Promise<string> {
    const findUser = await this.userDB.findOneBy({ id });
    console.log('user find ? : ', findUser);
    console.log('user from request: ', user);
    if (this.isOwnerOrAdmin(findUser, user)) {
      await this.userDB.delete(id);
      return `User n°${id} deleted.`;
    } else {
      throw new ForbiddenException('acces unauthorized');
    }
  }

  isOwnerOrAdmin(objet: any, user: any): boolean {
    return user.role === Role.ADMIN || (objet && objet.id === user.id);
  }
}
