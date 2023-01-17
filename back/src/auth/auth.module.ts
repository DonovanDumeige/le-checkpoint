import { forwardRef, Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtStrategy } from '../assets/strategy/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from 'src/assets/guard/jwt-auth.guard';
import { UserEntity } from 'src/assets/entities';
import { AuthService } from './auth.service';
import { RolesGuard } from 'src/assets/guard';
import { AuthController } from './auth.controller';

@Global()
@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [AuthService, RolesGuard, JwtAuthGuard, JwtStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
