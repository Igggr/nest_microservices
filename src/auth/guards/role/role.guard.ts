import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles-auth-decorator';


@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
  ) { }
  
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // получает то, что было выставлено через SetMetadata по ключу ROLES_KEY
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    console.log(`Route require roles: ${requiredRoles}`);
    if (!requiredRoles) {
      return true;
    }
    const req = context.switchToHttp().getRequest();

    // Guard работает после Muddleware. Если можно было выставить пользовтеля -
    // JwtMiddleware уже сделала бы это
    const user = req.user;

    if (!user) {
      return false;  // у анонима роли быть не может
    }
    console.log(`User roles: ${user.roles}`);
    return user.roles.some(role => requiredRoles.includes(role));
  }
}
