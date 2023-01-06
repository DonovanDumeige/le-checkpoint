import { SetMetadata } from '@nestjs/common';
import { Role } from '../models/enum/role.enum';

export const ROLES_KEY = 'hasRoles';
export const HasRoles = (...hasRoles: Role[]) =>
  SetMetadata(ROLES_KEY, hasRoles);
