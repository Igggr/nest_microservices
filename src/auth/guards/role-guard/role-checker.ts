import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { SetMetadata } from "@nestjs/common";


export const ROLES_KEY = 'roles';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);


export abstract class AbstractRoleGuard implements CanActivate {

    constructor(
        protected readonly reflector: Reflector,
    ) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
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
        
        return this.check(req, user, requiredRoles);
    }

    abstract check(req, user, requiredRoles: string[]): boolean;

    hasRole(user, requiredRoles: string[]): boolean {
        console.log(`User roles: ${user.roles}`);
        return user.roles.some(role => requiredRoles.includes(role));
    } 
}