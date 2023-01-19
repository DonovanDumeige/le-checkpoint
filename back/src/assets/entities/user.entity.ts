import e from 'express';
import { Role } from 'src/assets/models/enum/role.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BlogEntity } from './blog.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  username: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @Column({ nullable: true })
  profileImage: string;

  @OneToMany(() => BlogEntity, (articles) => articles.author)
  articles: BlogEntity[];
}
