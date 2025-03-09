import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

interface JwtError {
  message: string;
  name: string;
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor() {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest<TUser = any>(
    err: JwtError | null,
    user: TUser | false,
    info: { message: string },
  ): TUser {
    if (err || !user) {
      throw new UnauthorizedException({
        message: 'Authentication failed',
        details: info?.message || 'Invalid or expired token',
        error: 'UNAUTHORIZED',
      });
    }
    return user;
  }
}
