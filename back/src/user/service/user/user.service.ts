import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateUserDTO } from 'src/user/models/updateUser.dto';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import * as argon from 'argon2';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userDB: Repository<UserEntity>,
  ) {}

  async findOne(id: number): Promise<UserEntity> {
    return await this.userDB.findOneBy({ id });
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userDB.find();
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
    const { password, ...result } = upUser;
    return result;
  }

  async deleteUser(id: number): Promise<string> {
    await this.userDB.delete(id);
    return `User n°${id} deleted.`;
  }
}
