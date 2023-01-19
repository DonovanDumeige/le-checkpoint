import { IsEnum, IsNotEmpty } from 'class-validator';
import { Role } from '../../enum/role.enum';

export class RoleUserDTO {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
