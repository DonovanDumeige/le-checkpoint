import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDTO, LoginDTO } from 'src/assets/models/';
import { UserEntity } from 'src/assets/entities';
import { Repository } from 'typeorm';
import * as argon from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userDB: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async signin(dto: CreateUserDTO) {
    const email = await this.userDB.findOneBy({ email: dto.email });
    if (email) throw new ConflictException('email or username already exist');

    if (dto.password !== dto.passwordConfirm)
      throw new ConflictException('use the same password');
    const hash = await argon.hash(dto.password);
    const user = this.userDB.create({ ...dto, password: hash });
    user.email = user.email.toLowerCase();

    try {
      await this.userDB.save(user);
      delete user.password;
    } catch (e) {
      throw new ConflictException('email or username already exist');
    }
    return {
      id: user.id,
      role: user.role,
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
          role: user.role,
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