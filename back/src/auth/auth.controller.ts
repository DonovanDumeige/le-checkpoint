import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDTO, LoginDTO } from 'src/assets/models';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signin')
  create(@Body() user: CreateUserDTO) {
    return this.authService.signin(user);
  }

  @Post('login')
  login(@Body() user: LoginDTO) {
    return this.authService.login(user);
  }
}
