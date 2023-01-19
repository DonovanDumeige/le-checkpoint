import { UserInterface } from './user.interface';

export interface BlogInterface {
  id?: number;
  title?: string;
  slug?: string;
  content?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  likes?: number;
  headerImage?: string;
  publishedDate?: Date;
  isPublished: boolean;
  author?: UserInterface;
}
