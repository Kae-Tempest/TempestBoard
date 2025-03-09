import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@shared/entities/User.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { LocalStragy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from 'src/app/users/users.service';
import { ResetPassword } from '@shared/entities/ResetPassword.entity';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User, ResetPassword]),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStragy, JwtStrategy, UsersService],
})
export class AuthModule {}
