import { User } from "./user.interface";


export interface BlogArticle {
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
  author?: User
}
