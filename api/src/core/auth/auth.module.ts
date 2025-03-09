import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.guard';
import { RolesGuard } from './guards/roles.guard';
import { PermissionsGuard } from './guards/permissions.guard';
import { Role } from '@shared/entities/Role.entity';
import { User } from '@shared/entities/User.entity';
import { Project } from '@shared/entities/Project.entity';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from '../filters/http-exception.filter';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [],
      inject: [],
      useFactory: () => ({
        secret: process.env.JWTSECRET || 'your-secret-key',
        signOptions: {
          expiresIn: process.env.EXPIRE_IN || '1d',
        },
      }),
    }),
    TypeOrmModule.forFeature([User, Role, Project]),
  ],
  providers: [
    JwtStrategy,
    JwtAuthGuard,
    RolesGuard,
    PermissionsGuard,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
  exports: [JwtAuthGuard, RolesGuard, PermissionsGuard],
})
export class AuthModule {}
