import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  username: string;
}
