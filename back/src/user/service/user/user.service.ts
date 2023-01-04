import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { CreateUserDTO } from 'src/user/models/createUser.dto';
import { UpdateUserDTO } from 'src/user/models/updateUser.dto';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userDB: Repository<UserEntity>,
  ) {}

  async create(dto: CreateUserDTO): Promise<UserEntity> {
    const user = this.userDB.create(dto);
    try {
      await this.userDB.save(user);
    } catch (e) {
      throw new ConflictException('username already exist');
    }

    return user;
  }

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
    const upUser = await this.userDB.save({ ...user, ...dto });

    // Alternative avec update
    //! Le résultat devient UpdateResult au lieu de Partial<Entity>
    // const upUser = await this.userDB.update({ id }, { ...dto });
    return upUser;
  }

  async deleteUser(id: number): Promise<string> {
    await this.userDB.delete(id);
    return `User n°${id} deleted.`;
  }
}
