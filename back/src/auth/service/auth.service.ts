import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO } from 'src/auth/models/createUser.dto';
import { UserEntity } from 'src/user/models/user.entity';
import { Repository } from 'typeorm';
import * as argon from 'argon2';
import { LoginDTO } from 'src/auth/models/Login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userDB: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signin(dto: CreateUserDTO) {
    const email = await this.userDB.findOneBy({ email: dto.email });
    console.log(email);
    if (email) throw new ConflictException('email or username already exist');

    const hash = await argon.hash(dto.password);
    const user = this.userDB.create({ ...dto, password: hash });
    user.email = user.email.toLowerCase();

    user.password = await argon.hash(user.password);

    try {
      await this.userDB.save(user);
    } catch (e) {
      throw new ConflictException('email or username already exist');
    }
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  }

  async login(dto: LoginDTO) {
    const { username, password } = dto;

    const user = await this.userDB
      .createQueryBuilder('user')
      .where('user.email = :username or user.username = :username', {
        username,
      })
      .getOne();

    if (!user) {
      throw new NotFoundException('user does not exist');
    }

    try {
      const isMatch = await argon.verify(user.password, password);
      if (!isMatch) {
        throw new ConflictException('username or password incorrect');
      } else {
        const payload = {
          id: user.id,
          username: user.username,
        };
        const jwt = await this.jwtService.signAsync(payload);
        return {
          access_token: jwt,
        };
      }
    } catch (err) {
      console.log('Error: ', err);
      return {
        status: err.status,
        message: err.message,
      };
    }
  }
}
