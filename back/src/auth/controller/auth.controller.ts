import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDTO } from '../models/createUser.dto';
import { LoginDTO } from '../models/Login.dto';
import { AuthService } from '../service/auth.service';

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
