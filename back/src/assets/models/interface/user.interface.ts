import { Role } from '../enum/role.enum';
import { BlogInterface } from './blog.interface';

export interface UserInterface {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
  profileImage?: string;
  articles?: BlogInterface[];
}
