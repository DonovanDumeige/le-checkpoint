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

export interface Meta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Links {
  first: string;
  previous: string;
  next: string;
  last: string;
}

export interface BlogArticlesPageable {
  items: BlogArticle[];
  meta: Meta;
  links: Links;
}

