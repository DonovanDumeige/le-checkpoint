import { Role } from '../enum/role.enum';

export interface UserInterface {
  id?: number;
  name?: string;
  username?: string;
  email?: string;
  password?: string;
  role?: Role;
}
