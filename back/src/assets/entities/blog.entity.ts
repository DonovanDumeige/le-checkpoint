import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TimeStampEntity } from './timestamp.entity';
import { UserEntity } from './user.entity';

@Entity('blog')
export class BlogEntity extends TimeStampEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  slug: string;

  @Column({ default: '' })
  description: string;

  @Column({ default: '' })
  content: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ default: null })
  headerImage: string;

  @Column({ default: null })
  publishedDate: Date;

  @Column({ default: false })
  isPublished: boolean;

  @ManyToOne(() => UserEntity, (author) => author.articles, {
    eager: true,
    cascade: ['insert', 'update'],
  })
  author: UserEntity;
}
